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
const openLoginBtn = document.getElementById("open-login");
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

tabs.forEach(function (tab) {
  tab.addEventListener("click", function () {
    switchTab(tab.dataset.tab);
  });
});

if (openLoginBtn) {
  openLoginBtn.addEventListener("click", function () {
    switchTab("login");
    authModal.showModal();
  });
}

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

function renderAuthArea(user) {
  authArea.innerHTML = "";
  if (user) {
    var chip = document.createElement("div");
    chip.className = "user-chip";
    var initial = (user.displayName || user.email || "?").trim().charAt(0).toUpperCase();
    chip.innerHTML =
      '<span class="user-avatar">' + initial + "</span>" +
      '<span class="user-name">' + (user.displayName || user.email) + "</span>" +
      '<button type="button" class="user-logout" id="logout-btn">Đăng xuất</button>';
    authArea.appendChild(chip);
    document.getElementById("logout-btn").addEventListener("click", function () {
      signOut(auth);
    });
  } else {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-ghost btn-sm";
    btn.id = "open-login";
    btn.textContent = "Đăng nhập";
    btn.addEventListener("click", function () {
      switchTab("login");
      authModal.showModal();
    });
    authArea.appendChild(btn);
  }
}

onAuthStateChanged(auth, renderAuthArea);
