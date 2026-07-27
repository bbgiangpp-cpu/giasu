import { app } from "./firebase-app.js";
import { auth, openLogin } from "./auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getDatabase,
  ref,
  push,
  set,
  remove,
  onValue,
  onDisconnect,
  serverTimestamp,
  query,
  orderByChild,
  limitToLast
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const db = getDatabase(app);

const chatToggle = document.getElementById("chat-toggle");
const chatPanel = document.getElementById("chat-panel");
const chatClose = document.getElementById("chat-close");
const chatBadge = document.getElementById("chat-badge");
const chatOnlineList = document.getElementById("chat-online-list");
const chatOnlineCount = document.getElementById("chat-online-count");
const chatMessages = document.getElementById("chat-messages");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatGuestNotice = document.getElementById("chat-guest-notice");
const chatLoginBtn = document.getElementById("chat-login-btn");

function escapeHtml(str) {
  var div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}

chatToggle.addEventListener("click", function () {
  var isOpen = chatPanel.classList.toggle("open");
  chatToggle.setAttribute("aria-expanded", String(isOpen));
  if (isOpen) chatMessages.scrollTop = chatMessages.scrollHeight;
});
chatClose.addEventListener("click", function () {
  chatPanel.classList.remove("open");
  chatToggle.setAttribute("aria-expanded", "false");
});
chatLoginBtn.addEventListener("click", openLogin);

// ---- Presence: who's currently online ----
var myPresenceRef = null;

function goOnline(user) {
  myPresenceRef = ref(db, "presence/" + user.uid);
  set(myPresenceRef, {
    name: user.displayName || user.email || "Ẩn danh",
    lastSeen: serverTimestamp()
  });
  onDisconnect(myPresenceRef).remove();
  window.__beforeLogout = window.__beforeLogout || [];
  window.__beforeLogout.push(function () {
    return myPresenceRef ? remove(myPresenceRef) : Promise.resolve();
  });
}

onValue(ref(db, "presence"), function (snap) {
  var val = snap.val() || {};
  var names = Object.keys(val).map(function (uid) { return val[uid].name || "Ẩn danh"; });
  chatOnlineCount.textContent = names.length;
  chatBadge.textContent = names.length;
  chatBadge.hidden = names.length === 0;
  chatOnlineList.innerHTML = names.length
    ? names.map(function (n) {
        return '<li class="chat-online-item"><span class="chat-online-dot"></span>' + escapeHtml(n) + "</li>";
      }).join("")
    : '<li class="chat-online-empty">Chưa có ai online</li>';
});

// ---- Messages ----
var messagesQuery = query(ref(db, "chat/messages"), orderByChild("timestamp"), limitToLast(50));

onValue(messagesQuery, function (snap) {
  var items = [];
  snap.forEach(function (child) { items.push(child.val()); });
  chatMessages.innerHTML = items.length
    ? items.map(renderMessage).join("")
    : '<p class="chat-empty">Chưa có tin nhắn nào — hãy là người mở đầu!</p>';
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

function renderMessage(msg) {
  var isMine = auth.currentUser && msg.uid === auth.currentUser.uid;
  var time = msg.timestamp
    ? new Date(msg.timestamp).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
    : "";
  return (
    '<div class="chat-msg' + (isMine ? " mine" : "") + '">' +
    '<span class="chat-msg-name">' + escapeHtml(msg.name) + '</span>' +
    '<p class="chat-msg-text">' + escapeHtml(msg.text) + '</p>' +
    '<span class="chat-msg-time">' + time + '</span>' +
    "</div>"
  );
}

chatForm.addEventListener("submit", function (e) {
  e.preventDefault();
  var user = auth.currentUser;
  if (!user) return;
  var text = chatInput.value.trim();
  if (!text) return;
  push(ref(db, "chat/messages"), {
    uid: user.uid,
    name: user.displayName || user.email || "Ẩn danh",
    text: text.slice(0, 500),
    timestamp: Date.now()
  });
  chatInput.value = "";
});

// ---- Show chat form only when logged in ----
onAuthStateChanged(auth, function (user) {
  if (user) {
    chatGuestNotice.hidden = true;
    chatForm.hidden = false;
    goOnline(user);
  } else {
    chatGuestNotice.hidden = false;
    chatForm.hidden = true;
    myPresenceRef = null;
  }
});
