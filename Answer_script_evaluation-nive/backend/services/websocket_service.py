from routers.websocket import clients

async def send_progress(message: str):

    disconnected = []

    for client in clients:
        try:
            await client.send_json({
                "message": message
            })
        except Exception:
            disconnected.append(client)

    for client in disconnected:
        if client in clients:
            clients.remove(client)