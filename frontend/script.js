const modeSelect = document.getElementById("mode-select");
const statusBadge = document.getElementById("status-badge");
const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const usernameInput = document.getElementById("username");
const chatContainer = document.querySelector(".chat-container");

let sockets = {
  ENCRYPTED: null,
  UNENCRYPTED: null
};

let currentMode = "UNENCRYPTED";

const SERVERS = {
  ENCRYPTED: "ws://localhost:8080/ws",
  UNENCRYPTED: "ws://localhost:8000/ws",
};

function connectSocket(mode) {
  const url = SERVERS[mode];

  const socket = new WebSocket(url);

  socket.onopen = () => {
    sockets[mode] = socket;
    updateUI();
    appendSystemMessage(`Conectado en modo ${mode}`);
  };

  socket.onmessage = (event) => {
    if (mode === currentMode) {
      appendMessage(event.data);
    }
  };

  socket.onclose = () => {
    sockets[mode] = null;
    updateUI();
    appendSystemMessage(`${mode} desconectado`);
  };

  socket.onerror = (err) => {
    console.error(`Error en ${mode}:`, err);
    appendSystemMessage(`Error en ${mode}`);
  };

  return socket;
}

function updateUI() {
  const mode = currentMode;
  const isConnected = sockets[mode] && sockets[mode].readyState === WebSocket.OPEN;

  statusBadge.textContent = mode;
  statusBadge.className = isConnected
    ? "badge " + (mode === "ENCRYPTED" ? "connected-encrypted" : "connected-unencrypted")
    : "badge";

  chatContainer.className = "chat-container " + (mode === "ENCRYPTED" ? "mode-encrypted" : "mode-unencrypted");
  messageInput.disabled = !isConnected;
  sendBtn.disabled = !isConnected;
}

function switchMode(mode) {
  currentMode = mode;
  updateUI();
}

function connect() {
  connectSocket("ENCRYPTED");
  connectSocket("UNENCRYPTED");
}

function appendMessage(text) {
  const div = document.createElement("div");
  div.className = "msg";
  div.textContent = text;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function appendSystemMessage(text) {
  const div = document.createElement("div");
  div.className = "msg";
  div.textContent = text;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function sendMessage() {
  const text = messageInput.value.trim();
  const username = usernameInput.value.trim() || "Anon";
  const socket = sockets[currentMode];

  if (!text || !socket || socket.readyState !== WebSocket.OPEN) return;

  const fullMessage = `${username}: ${text}`;
  socket.send(fullMessage);
  messageInput.value = "";
}

sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

modeSelect.addEventListener("change", () => {
  const newMode = modeSelect.value;
  currentMode = newMode;
  switchMode(currentMode);

  if (!sockets[newMode]) {
    appendSystemMessage(`Conectando a ${newMode}...`);
    connectSocket(newMode);
  } else {
    appendSystemMessage(`Cambiando a ${newMode}`);
  }
});

// Conectar automáticamente al cargar la página
connect();