import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BRIDGE_SERVER, {
  transports: ["websocket"],
  path: "/ws",
  autoConnect: false,
});

export default socket;
