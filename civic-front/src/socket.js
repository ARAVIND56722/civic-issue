// src/socket.js
import { io } from "socket.io-client";

const URL = process.env.REACT_APP_API_URL || "https://civic-issue-h6x8.onrender.com";

const socket = io(URL, {
  autoConnect: true,
  transports: ["websocket"],
});

export default socket;
