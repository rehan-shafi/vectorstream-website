const chatIcon = document.getElementById('chat-icon');
const chatBox = document.getElementById('chat-box');
const closeBtn = document.getElementById('close-chat');
const sendBtn = document.getElementById('chat-send-btn');
const userInput = document.getElementById('chat-input-field');
const messages = document.getElementById('chat-messages');

chatIcon.onclick = () => {
  chatBox.classList.add('open');
  chatIcon.style.display = 'none';
};

closeBtn.onclick = () => {
  chatBox.classList.remove('open');
  chatIcon.style.display = 'block';
};

function appendMessage(role, text) {
  const msg = document.createElement("div");
  msg.className = `msg ${role === "You" ? "msg-user" : "msg-bot"}`;

  const messageText = document.createElement("div");
  messageText.textContent = text;

  const timestamp = document.createElement("div");
  timestamp.className = "timestamp";
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  timestamp.textContent = timeString;

  msg.appendChild(messageText);
  msg.appendChild(timestamp);

  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

function showTypingIndicator() {
  const typingContainer = document.createElement("div");
  typingContainer.className = "typing-indicator temp-msg";

  for (let i = 0; i < 3; i++) {
    const dot = document.createElement("div");
    dot.className = "typing-dot";
    typingContainer.appendChild(dot);
  }

  // Clear floats before appending
  const clearDiv = document.createElement("div");
  clearDiv.style.clear = "both";
  messages.appendChild(clearDiv);

  messages.appendChild(typingContainer);
  messages.scrollTop = messages.scrollHeight;

  return typingContainer;
}


async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage("You", message);
  userInput.value = "";

  // Show animated typing indicator
  const typingIndicator = showTypingIndicator();

  try {
    const res = await fetch("https://multi-tenant-chatbot-production.up.railway.app/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "mustaqbal-uni-key-2025"
      },
      body: JSON.stringify({ message, role: "teacher" })
    });

    const data = await res.json();

    typingIndicator.remove(); // Remove loader
    appendMessage("Bot", data.answer);
  } catch (error) {
    typingIndicator.remove();
    appendMessage("Bot", "Sorry, something went wrong.");
  }
}



sendBtn.onclick = sendMessage;

userInput.addEventListener("input", () => {
  userInput.style.height = "auto";
  userInput.style.height = userInput.scrollHeight + "px";
});

userInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    if (event.shiftKey) {
      // Allow newline on Shift+Enter
      return;
    } else {
      event.preventDefault(); // Prevent newline
      sendMessage();          // Trigger send
    }
  }
});

// Hide chat box when clicking outside
document.addEventListener("click", function (event) {
  const isClickInside = chatBox.contains(event.target) || chatIcon.contains(event.target);
  if (!isClickInside) {
    chatBox.classList.remove("open");
    chatIcon.style.display = 'block';
  }
});

// Hide chat box on Escape key
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    chatBox.classList.remove("open");
    chatIcon.style.display = 'block';
  }
});

