const modeSelect = document.getElementById("mode-select");
const statusBadge = document.getElementById("status-badge");
const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const usernameInput = document.getElementById("username");

let socket = null;

const SERVERS = {
  ENCRYPTED: "wss://localhost:8080/ws",
  UNENCRYPTED: "ws://localhost:8000/ws",
};

function connect() {
  const mode = modeSelect.value;
  const url = SERVERS[mode];

  if (socket) {
    socket.close();
  }

  statusBadge.textContent = "CONECTANDO...";
  statusBadge.className = "badge";

  socket = new WebSocket(url);

  socket.onopen = () => {
    statusBadge.textContent = mode;
    statusBadge.className =
      "badge " + (mode === "ENCRYPTED" ? "connected-encrypted" : "connected-unencrypted");
    messageInput.disabled = false;
    sendBtn.disabled = false;
    appendSystemMessage(`Conectado en modo ${mode}`);
  };

  socket.onmessage = (event) => {
    appendMessage(event.data);
  };

  socket.onclose = () => {
    statusBadge.textContent = "DESCONECTADO";
    statusBadge.className = "badge";
    messageInput.disabled = true;
    sendBtn.disabled = true;
  };

  socket.onerror = (err) => {
    console.error("Error de conexión:", err);
    appendSystemMessage("Error de conexión (revisa la consola)");
  };
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
  div.innerHTML = `<i>${text}</i>`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function sendMessage() {
  const text = messageInput.value.trim();
  const username = usernameInput.value.trim() || "Anon";
  if (!text || !socket || socket.readyState !== WebSocket.OPEN) return;

  const fullMessage = `${username}: ${text}`;
  socket.send(fullMessage);
  messageInput.value = "";
}

sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
modeSelect.addEventListener("change", connect);

// Conectar automáticamente al cargar la página
connect();