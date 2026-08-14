from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()

clients = []

@router.websocket("/ws/progress")
async def websocket_endpoint(websocket: WebSocket):

    await websocket.accept()

    clients.append(websocket)

    try:
        while True:
            await websocket.receive_text()

    except WebSocketDisconnect:

        if websocket in clients:
            clients.remove(websocket)