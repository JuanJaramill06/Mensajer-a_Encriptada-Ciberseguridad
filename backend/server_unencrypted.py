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
    print(f"[UNENCRYPTED] Cliente conectado. Total: {len(clients)}")
    try:
        while True:
            data = await websocket.receive_text()
            print(f"[UNENCRYPTED] Mensaje recibido: {data}")
            for client in clients:
                await client.send_text(data)
    except WebSocketDisconnect:
        clients.remove(websocket)
        print(f"[UNENCRYPTED] Cliente desconectado. Total: {len(clients)}")

if __name__ == "__main__":
    print("Servidor NO CIFRADO corriendo en ws://localhost:8000/ws")
    uvicorn.run(app, host="0.0.0.0", port=8000)