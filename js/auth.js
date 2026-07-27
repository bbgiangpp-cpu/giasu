import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const ERROR_MESSAGES = {
  "auth/email-already-in-use": "Email này đã được đăng ký. Hãy đăng nhập thay vì đăng ký lại.",
  "auth/invalid-email": "Email không hợp lệ.",
  "auth/weak-password": "Mật khẩu quá ngắn (tối thiểu 6 ký tự).",
  "auth/user-not-found": "Không tìm thấy tài khoản với email này.",
  "auth/wrong-password": "Sai mật khẩu.",
  "auth/invalid-credential": "Email hoặc mật khẩu không đúng.",
  "auth/too-many-requests": "Bạn thử sai quá nhiều lần. Vui lòng đợi một chút rồi thử lại."
};

function friendlyError(err) {
  return ERROR_MESSAGES[err.code] || "Có lỗi xảy ra, vui lòng thử lại.";
}

const authModal = document.getElementById("auth-modal");
const authArea = document.getElementById("auth-area");
const authModalClose = document.getElementById("auth-modal-close");
const tabs = document.querySelectorAll(".auth-tab");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const loginError = document.getElementById("login-error");
const registerError = document.getElementById("register-error");

function switchTab(name) {
  tabs.forEach(function (t) {
    t.classList.toggle("active", t.dataset.tab === name);
  });
  loginForm.hidden = name !== "login";
  registerForm.hidden = name !== "register";
  loginError.textContent = "";
  registerError.textContent = "";
}

function openAuth(tabName) {
  switchTab(tabName);
  authModal.showModal();
}

function wireOpenButtons() {
  var loginBtn = document.getElementById("open-login");
  var registerBtn = document.getElementById("open-register");
  if (loginBtn) loginBtn.addEventListener("click", function () { openAuth("login"); });
  if (registerBtn) registerBtn.addEventListener("click", function () { openAuth("register"); });
}
wireOpenButtons();

tabs.forEach(function (tab) {
  tab.addEventListener("click", function () {
    switchTab(tab.dataset.tab);
  });
});

authModalClose.addEventListener("click", function () {
  authModal.close();
});
authModal.addEventListener("click", function (e) {
  var box = authModal.getBoundingClientRect();
  var inside = e.clientX >= box.left && e.clientX <= box.right && e.clientY >= box.top && e.clientY <= box.bottom;
  if (!inside) authModal.close();
});

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  loginError.textContent = "";
  var email = loginForm.email.value.trim();
  var password = loginForm.password.value;
  signInWithEmailAndPassword(auth, email, password)
    .then(function () {
      authModal.close();
      loginForm.reset();
    })
    .catch(function (err) {
      loginError.textContent = friendlyError(err);
    });
});

registerForm.addEventListener("submit", function (e) {
  e.preventDefault();
  registerError.textContent = "";
  var name = registerForm.name.value.trim();
  var email = registerForm.email.value.trim();
  var password = registerForm.password.value;
  var confirm = registerForm.confirm.value;

  if (password !== confirm) {
    registerError.textContent = "Mật khẩu nhập lại không khớp.";
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then(function (cred) {
      return updateProfile(cred.user, { displayName: name });
    })
    .then(function () {
      authModal.close();
      registerForm.reset();
    })
    .catch(function (err) {
      registerError.textContent = friendlyError(err);
    });
});

// ---- Profile modal ----
const profileModal = document.getElementById("profile-modal");
const profileModalClose = document.getElementById("profile-modal-close");
const profileForm = document.getElementById("profile-form");
const profileError = document.getElementById("profile-error");
const profileSuccess = document.getElementById("profile-success");

profileModalClose.addEventListener("click", function () { profileModal.close(); });
profileModal.addEventListener("click", function (e) {
  var box = profileModal.getBoundingClientRect();
  var inside = e.clientX >= box.left && e.clientX <= box.right && e.clientY >= box.top && e.clientY <= box.bottom;
  if (!inside) profileModal.close();
});

function openProfileModal() {
  var user = auth.currentUser;
  if (!user) return;
  profileError.textContent = "";
  profileSuccess.textContent = "";
  profileForm.name.value = user.displayName || "";
  profileForm.email.value = user.email || "";
  profileModal.showModal();
}

profileForm.addEventListener("submit", function (e) {
  e.preventDefault();
  profileError.textContent = "";
  profileSuccess.textContent = "";
  var name = profileForm.name.value.trim();
  updateProfile(auth.currentUser, { displayName: name })
    .then(function () {
      profileSuccess.textContent = "Đã lưu thay đổi.";
      renderAuthArea(auth.currentUser);
    })
    .catch(function (err) {
      profileError.textContent = friendlyError(err);
    });
});

// ---- Nav auth area: guest buttons vs. logged-in chip with dropdown ----
function closeAllMenus() {
  document.querySelectorAll(".user-menu.open").forEach(function (m) { m.classList.remove("open"); });
}
document.addEventListener("click", closeAllMenus);
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeAllMenus();
});

function renderAuthArea(user) {
  authArea.innerHTML = "";
  if (user) {
    var wrap = document.createElement("div");
    wrap.className = "user-chip-wrap";

    var trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "user-chip";
    trigger.setAttribute("aria-haspopup", "true");
    trigger.setAttribute("aria-expanded", "false");

    var initial = (user.displayName || user.email || "?").trim().charAt(0).toUpperCase();
    var avatar = document.createElement("span");
    avatar.className = "user-avatar";
    avatar.textContent = initial;
    var statusDot = document.createElement("span");
    statusDot.className = "user-status-dot";
    statusDot.title = "Đang đăng nhập";
    avatar.appendChild(statusDot);

    var nameEl = document.createElement("span");
    nameEl.className = "user-name";
    nameEl.textContent = user.displayName || user.email;

    var caret = document.createElement("span");
    caret.className = "user-caret";
    caret.textContent = "▾";

    trigger.appendChild(avatar);
    trigger.appendChild(nameEl);
    trigger.appendChild(caret);

    var menu = document.createElement("div");
    menu.className = "user-menu";
    menu.innerHTML =
      '<button type="button" class="user-menu-item" id="menu-profile">🧑 Tùy chỉnh hồ sơ</button>' +
      '<a class="user-menu-item" href="#tien-do" id="menu-progress">📊 Theo dõi tiến độ học tập</a>' +
      '<button type="button" class="user-menu-item danger" id="menu-logout">🚪 Đăng xuất</button>';

    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      var isOpen = menu.classList.contains("open");
      closeAllMenus();
      menu.classList.toggle("open", !isOpen);
      trigger.setAttribute("aria-expanded", String(!isOpen));
    });
    menu.addEventListener("click", function (e) { e.stopPropagation(); });

    wrap.appendChild(trigger);
    wrap.appendChild(menu);
    authArea.appendChild(wrap);

    menu.querySelector("#menu-profile").addEventListener("click", function () {
      closeAllMenus();
      openProfileModal();
    });
    menu.querySelector("#menu-progress").addEventListener("click", function () {
      closeAllMenus();
    });
    menu.querySelector("#menu-logout").addEventListener("click", function () {
      closeAllMenus();
      signOut(auth);
    });
  } else {
    authArea.innerHTML =
      '<button type="button" class="auth-text-link" id="open-register">Đăng ký</button>' +
      '<button type="button" class="btn btn-ghost btn-sm" id="open-login">Đăng nhập</button>';
    wireOpenButtons();
  }
}

onAuthStateChanged(auth, renderAuthArea);
