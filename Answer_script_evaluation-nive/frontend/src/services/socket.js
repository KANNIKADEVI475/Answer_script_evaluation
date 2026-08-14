const getWebSocketUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl) {
    const wsProto = apiUrl.startsWith("https") ? "wss" : "ws";
    const host = apiUrl.replace(/^https?:\/\//, "");
    return `${wsProto}://${host}/ws/progress`;
  }
  return "ws://localhost:8000/ws/progress";
};

const socket = new WebSocket(getWebSocketUrl());

export default socket;
