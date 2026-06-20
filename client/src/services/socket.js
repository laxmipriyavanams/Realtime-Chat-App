import { io } from "socket.io-client";

const socket = io(
  "https://realtime-chat-app-production-e26c.up.railway.app"
);

export default socket;