const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");
const chatContainer = document.querySelector(".chat-container");

let userText;
const API_KEY = "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";
const initialHeight = chatInput.scrollHeight;
// malumotni keshda saqlash uchun 👇
const loadDataFromLocalstorage = () => {
  const defaultText = `<div class="default-text">
                            <h1>ChatGPT</h1>
                            <p>Assalomu alaykum 👋<br> Sizga bugun qanday yordam bera olaman?</p>
                         </div>`;
  chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
};
loadDataFromLocalstorage();
// malumotni keshda saqlash uchun 👆
const createElement = (html, className) => {
  const chatDiv = document.createElement("div");
  chatDiv.classList.add("chat", className);
  chatDiv.innerHTML = html;
  return chatDiv;
};

const getChatResponse = async (incomingChatDiv) => {
  const API_URL = "https://api.openai.com/v1/completions";
  const pElement = document.createElement("p");

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: userText,
      max_tokens: 2048,
      temperature: 0.2,
      n: 1,
      stop: null,
    }),
  };

  try {
    const response = await (await fetch(API_URL, requestOptions)).json();
    pElement.textContent = response.choices[0].text.trim();
  } catch (error) {
    pElement.classList.add("error");
    pElement.textContent = "Xatolik yuz berdi iltimos qayta urunib ko'ring !";
  }

  incomingChatDiv.querySelector(".typing-animation").remove();
  incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  localStorage.setItem("all-chats", chatContainer.innerHTML); // malumotni keshda saqlash uchun
};

const copyResponse = (copyBtn) => {
  const responseTextElement = copyBtn.parentElement.querySelector("p");
  navigator.clipboard.writeText(responseTextElement.textContent);
  copyBtn.classList = "bx bx-check";
  setTimeout(() => (copyBtn.classList = "bx bx-copy"), 1000);
};

const showTypingAnimation = () => {
  const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="assets/images/logo.png" alt="chatbot">
                        <div class="typing-animation">
                            <div class="typing-dot" style="--delay: 0.2s"></div>
                            <div class="typing-dot" style="--delay: 0.3s"></div>
                            <div class="typing-dot" style="--delay: 0.4s"></div>
                        </div>
                        </div>
                        <i class="bx bx-copy" onclick="copyResponse(this)" title="Ko'chirmoq"></i>
                  </div>`;

  const incomingChatDiv = createElement(html, "incoming");
  chatContainer.appendChild(incomingChatDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  getChatResponse(incomingChatDiv);
};

const handleOutgoingChat = () => {
  userText = chatInput.value.trim();
  if (!userText) return;
  chatInput.value = "";

  const html = `<div class="chat-content">
                        <div class="chat-details">
                            <img src="assets/images/User.png" alt="user">
                            <p class='type'>${userText}</p>
                        </div>
                    </div>`;
  const outgoingChatDiv = createElement(html, "outgoing");
  outgoingChatDiv.querySelector("p").textContent = userText;
  document.querySelector(".default-text")?.remove();
  chatContainer.appendChild(outgoingChatDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  setTimeout(showTypingAnimation, 500);
};

themeButton.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  localStorage.setItem("theme-color", themeButton.innerText);
  themeButton.classList = document.body.classList.contains("light-mode")
    ? "bx bx-moon"
    : "bx bx-sun";
});

deleteButton.addEventListener("click", () => {
  if (confirm("Siz chat tarixini o'chirmoqchimisiz?")) {
    localStorage.removeItem("all-chats");
    loadDataFromLocalstorage();
  }
});

chatInput.addEventListener("input", () => {
  chatInput.style.height = `${initialHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleOutgoingChat();
  }
});

sendButton.addEventListener("click", handleOutgoingChat);
