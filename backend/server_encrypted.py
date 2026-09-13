from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

clients: list[WebSocket] = []

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)
    print(f"[ENCRYPTED] Cliente conectado. Total: {len(clients)}")
    try:
        while True:
            data = await websocket.receive_text()
            print(f"[ENCRYPTED] Mensaje recibido: {data}")
            for client in clients:
                await client.send_text(data)
    except WebSocketDisconnect:
        clients.remove(websocket)
        print(f"[ENCRYPTED] Cliente desconectado. Total: {len(clients)}")

if __name__ == "__main__":
    print("Servidor CIFRADO corriendo en wss://localhost:8080/ws")
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8080,
        ssl_certfile="certs/cert.pem",
        ssl_keyfile="certs/key.pem",
    )