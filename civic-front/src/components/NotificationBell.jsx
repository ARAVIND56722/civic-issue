// src/components/NotificationBell.jsx
import React, { useContext, useEffect, useState } from "react";
import socket from "../socket";
import { AuthContext } from "../contexts/AuthContext";
import {
  fetchNotifications,
  markNotificationRead,
  markAllRead,
} from "../services/notificationService";

export default function NotificationBell() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    let mounted = true;

    // 1) load existing notifications from API
    (async () => {
      try {
        const list = await fetchNotifications(user._id);
        if (mounted) {
          setNotifications(Array.isArray(list) ? list : []);
        }
      } catch (e) {
        console.error("❌ Failed to fetch notifications:", e);
        if (mounted) setNotifications([]);
      }
    })();

    // 2) listen for real-time incoming notifications
    const handler = (notification) => {
      const newNotifications = Array.isArray(notification)
        ? notification
        : [notification];
      setNotifications((prev) => [...newNotifications, ...prev]);
    };

    socket.on("notification", handler);

    return () => {
      mounted = false;
      socket.off("notification", handler);
    };
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button onClick={() => setOpen(!open)}>
        🔔 {unreadCount > 0 && <span>({unreadCount})</span>}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            background: "white",
            border: "1px solid #ccc",
            padding: 8,
            width: 300,
            maxHeight: 400,
            overflowY: "auto",
            zIndex: 1000,
          }}
        >
          <button
            onClick={() => {
              markAllRead(user._id);
              setNotifications((prev) =>
                prev.map((n) => ({ ...n, read: true }))
              );
            }}
          >
            Mark all as read
          </button>

          <ul style={{ listStyle: "none", padding: 0 }}>
            {notifications.map((n) => (
              <li
                key={n._id || Math.random()} // fallback for dummy/test data
                style={{ margin: "8px 0", cursor: "pointer" }}
              >
                <div
                  onClick={async () => {
                    if (n._id) {
                      await markNotificationRead(n._id);
                      setNotifications((prev) =>
                        prev.map((p) =>
                          p._id === n._id ? { ...p, read: true } : p
                        )
                      );
                    }
                    if (n.data && n.data.issueId) {
                      window.location.href = `/issues/${n.data.issueId}`;
                    }
                  }}
                >
                  <strong>{n.title || "Notification"}</strong>
                  <div>{n.message || ""}</div>
                  <small>
                    {n.createdAt
                      ? new Date(n.createdAt).toLocaleString()
                      : ""}
                  </small>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
