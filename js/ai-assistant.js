import { auth, openLogin } from "./auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Cloudflare Worker that proxies to the Anthropic API — keeps the real
// API key server-side instead of exposing it in this public repo.
const WORKER_URL = "https://green-hill-c52c.bbgiang-pp.workers.dev";

function escapeHtml(str) {
  var div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}

// ---- Tabs: Cộng đồng vs Hỏi AI ----
var tabs = document.querySelectorAll(".chat-tab");
var panels = {
  community: document.getElementById("tab-community"),
  ai: document.getElementById("tab-ai")
};
tabs.forEach(function (tab) {
  tab.addEventListener("click", function () {
    tabs.forEach(function (t) { t.classList.toggle("active", t === tab); });
    Object.keys(panels).forEach(function (key) {
      panels[key].hidden = key !== tab.dataset.tab;
    });
  });
});

// ---- Ask AI form ----
var aiForm = document.getElementById("ai-form");
var aiInput = document.getElementById("ai-input");
var aiSend = document.getElementById("ai-send");
var aiAnswer = document.getElementById("ai-answer");
var aiGuestNotice = document.getElementById("ai-guest-notice");

document.getElementById("ai-login-btn").addEventListener("click", openLogin);

onAuthStateChanged(auth, function (user) {
  aiGuestNotice.hidden = !!user;
  aiForm.hidden = !user;
});

aiForm.addEventListener("submit", function (e) {
  e.preventDefault();
  var question = aiInput.value.trim();
  if (!question) return;

  aiAnswer.innerHTML =
    '<p class="ai-user-q">' + escapeHtml(question) + "</p>" +
    '<p class="ai-loading">Đang suy nghĩ...</p>';
  aiInput.value = "";
  aiSend.disabled = true;

  fetch(WORKER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: question })
  })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      aiAnswer.innerHTML =
        '<p class="ai-user-q">' + escapeHtml(question) + "</p>" +
        '<p class="ai-answer-text">' + escapeHtml(data.answer || data.error || "Không có phản hồi.") + "</p>";
    })
    .catch(function () {
      aiAnswer.innerHTML =
        '<p class="ai-user-q">' + escapeHtml(question) + "</p>" +
        '<p class="ai-error">Có lỗi kết nối tới trợ lý AI, thử lại nhé.</p>';
    })
    .finally(function () {
      aiSend.disabled = false;
    });
});
