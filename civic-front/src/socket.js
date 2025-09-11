// src/socket.js
import { io } from "socket.io-client";

const URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const socket = io(URL, {
  autoConnect: true,
  transports: ["websocket"],
});

export default socket;
