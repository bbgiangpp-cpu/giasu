import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

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

// ---- Simple self-built captcha (no external service) ----
function makeCaptcha(questionEl, inputEl, refreshBtn) {
  var answer = 0;
  function generate() {
    var a = Math.floor(Math.random() * 9) + 1;
    var b = Math.floor(Math.random() * 9) + 1;
    answer = a + b;
    questionEl.textContent = a + " + " + b + " = ?";
    inputEl.value = "";
  }
  refreshBtn.addEventListener("click", generate);
  generate();
  return {
    check: function () { return Number(inputEl.value) === answer; },
    reset: generate
  };
}

const loginCaptcha = makeCaptcha(
  document.getElementById("login-captcha-q"),
  document.getElementById("login-captcha-input"),
  document.getElementById("login-captcha-refresh")
);
const registerCaptcha = makeCaptcha(
  document.getElementById("register-captcha-q"),
  document.getElementById("register-captcha-input"),
  document.getElementById("register-captcha-refresh")
);

// ---- Login / Register modals ----
const loginModal = document.getElementById("login-modal");
const registerModal = document.getElementById("register-modal");
const authArea = document.getElementById("auth-area");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const loginError = document.getElementById("login-error");
const registerError = document.getElementById("register-error");

function closeOnBackdrop(dialogEl) {
  dialogEl.addEventListener("click", function (e) {
    var box = dialogEl.getBoundingClientRect();
    var inside = e.clientX >= box.left && e.clientX <= box.right && e.clientY >= box.top && e.clientY <= box.bottom;
    if (!inside) dialogEl.close();
  });
}
closeOnBackdrop(loginModal);
closeOnBackdrop(registerModal);

document.getElementById("login-modal-close").addEventListener("click", function () { loginModal.close(); });
document.getElementById("register-modal-close").addEventListener("click", function () { registerModal.close(); });

function openLogin() {
  registerModal.close();
  loginError.textContent = "";
  loginCaptcha.reset();
  loginModal.showModal();
}
function openRegister() {
  loginModal.close();
  registerError.textContent = "";
  registerCaptcha.reset();
  registerModal.showModal();
}

document.getElementById("to-register").addEventListener("click", openRegister);
document.getElementById("to-login").addEventListener("click", openLogin);

function wireOpenButtons() {
  var loginBtn = document.getElementById("open-login");
  var registerBtn = document.getElementById("open-register");
  if (loginBtn) loginBtn.addEventListener("click", openLogin);
  if (registerBtn) registerBtn.addEventListener("click", openRegister);
}
wireOpenButtons();

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  loginError.textContent = "";
  if (!loginCaptcha.check()) {
    loginError.textContent = "Kết quả xác nhận chưa đúng, thử lại nhé.";
    loginCaptcha.reset();
    return;
  }
  var email = loginForm.email.value.trim();
  var password = loginForm.password.value;
  signInWithEmailAndPassword(auth, email, password)
    .then(function () {
      loginModal.close();
      loginForm.reset();
      loginCaptcha.reset();
    })
    .catch(function (err) {
      loginError.textContent = friendlyError(err);
      loginCaptcha.reset();
    });
});

registerForm.addEventListener("submit", function (e) {
  e.preventDefault();
  registerError.textContent = "";
  if (!registerCaptcha.check()) {
    registerError.textContent = "Kết quả xác nhận chưa đúng, thử lại nhé.";
    registerCaptcha.reset();
    return;
  }
  var name = registerForm.name.value.trim();
  var email = registerForm.email.value.trim();
  var password = registerForm.password.value;
  var confirm = registerForm.confirm.value;

  if (password !== confirm) {
    registerError.textContent = "Mật khẩu nhập lại không khớp.";
    registerCaptcha.reset();
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then(function (cred) {
      return updateProfile(cred.user, { displayName: name });
    })
    .then(function () {
      registerModal.close();
      registerForm.reset();
      registerCaptcha.reset();
    })
    .catch(function (err) {
      registerError.textContent = friendlyError(err);
      registerCaptcha.reset();
    });
});

// ---- Profile modal (name + avatar) ----
const profileModal = document.getElementById("profile-modal");
const profileModalClose = document.getElementById("profile-modal-close");
const profileForm = document.getElementById("profile-form");
const profileError = document.getElementById("profile-error");
const profileSuccess = document.getElementById("profile-success");
const profileSaveBtn = document.getElementById("profile-save-btn");
const avatarInput = document.getElementById("avatar-input");
const avatarPreview = document.getElementById("avatar-preview");
const avatarFallback = document.getElementById("avatar-preview-fallback");

var pendingAvatarFile = null;

closeOnBackdrop(profileModal);
profileModalClose.addEventListener("click", function () { profileModal.close(); });

function showAvatarPreview(src, fallbackLetter) {
  if (src) {
    avatarPreview.src = src;
    avatarPreview.hidden = false;
    avatarFallback.hidden = true;
  } else {
    avatarPreview.hidden = true;
    avatarFallback.hidden = false;
    avatarFallback.textContent = fallbackLetter || "?";
  }
}

avatarInput.addEventListener("change", function () {
  var file = avatarInput.files[0];
  profileError.textContent = "";
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    profileError.textContent = "Vui lòng chọn một file ảnh (JPG, PNG...).";
    avatarInput.value = "";
    return;
  }
  if (file.size > 3 * 1024 * 1024) {
    profileError.textContent = "Ảnh quá lớn, vui lòng chọn ảnh dưới 3MB.";
    avatarInput.value = "";
    return;
  }
  pendingAvatarFile = file;
  var reader = new FileReader();
  reader.onload = function () { showAvatarPreview(reader.result); };
  reader.readAsDataURL(file);
});

function openProfileModal() {
  var user = auth.currentUser;
  if (!user) return;
  profileError.textContent = "";
  profileSuccess.textContent = "";
  pendingAvatarFile = null;
  avatarInput.value = "";
  profileForm.name.value = user.displayName || "";
  profileForm.email.value = user.email || "";
  var initial = (user.displayName || user.email || "?").trim().charAt(0).toUpperCase();
  showAvatarPreview(user.photoURL || null, initial);
  profileModal.showModal();
}

profileForm.addEventListener("submit", function (e) {
  e.preventDefault();
  profileError.textContent = "";
  profileSuccess.textContent = "";
  var name = profileForm.name.value.trim();

  profileSaveBtn.disabled = true;
  profileSaveBtn.textContent = "Đang lưu...";

  var uploadStep = pendingAvatarFile
    ? uploadBytes(ref(storage, "avatars/" + auth.currentUser.uid), pendingAvatarFile).then(function (snap) {
        return getDownloadURL(snap.ref);
      })
    : Promise.resolve(auth.currentUser.photoURL || null);

  uploadStep
    .then(function (photoURL) {
      return updateProfile(auth.currentUser, { displayName: name, photoURL: photoURL });
    })
    .then(function () {
      profileSuccess.textContent = "Đã lưu thay đổi.";
      pendingAvatarFile = null;
      renderAuthArea(auth.currentUser);
    })
    .catch(function (err) {
      profileError.textContent = friendlyError(err);
    })
    .finally(function () {
      profileSaveBtn.disabled = false;
      profileSaveBtn.textContent = "Lưu thay đổi";
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
    if (user.photoURL) {
      var img = document.createElement("img");
      img.src = user.photoURL;
      img.alt = "";
      avatar.appendChild(img);
    } else {
      avatar.textContent = initial;
    }
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
