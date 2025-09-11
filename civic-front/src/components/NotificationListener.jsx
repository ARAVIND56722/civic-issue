// src/components/NotificationListener.jsx
import { useEffect } from "react";
import socket from "../socket";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function NotificationListener() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);

      // 🔑 Register the user with backend after connecting
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?._id) {
        socket.emit("register", user._id);
        console.log("✅ Registered user with socket:", user._id);
      } else {
        console.warn("⚠️ No user found in localStorage");
      }
    });

    socket.on("connect_error", (err) => console.error("Socket connect error:", err));

    // 🔔 Generic notifications from backend
    socket.on("notification", (data) => {
      console.log("📩 New notification:", data);
      toast.info(`Notification: ${data.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
    });

    // 🔔 Issue status updates
    socket.on("issueStatusUpdated", (data) => {
      console.log("🔔 Status update:", data);
      toast.info(`Issue ${data.issueId} status changed to ${data.status}`, {
        position: "top-right",
        autoClose: 5000,
      });
    });

    // 📌 Issue assignments
    socket.on("issueAssigned", (data) => {
      console.log("📌 Issue assigned:", data);
      toast.success(`Issue ${data.issueId} assigned to ${data.department}`, {
        position: "top-right",
        autoClose: 5000,
      });
    });

    // 🧹 Clean up listeners on unmount
    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("notification");
      socket.off("issueStatusUpdated");
      socket.off("issueAssigned");
    };
  }, []);

  return <ToastContainer />;
}

export default NotificationListener;
