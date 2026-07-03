// src/components/NotificationBell.jsx
import React, { useContext, useEffect, useState } from "react";
import socket from "../socket";
import { AuthContext } from "../contexts/AuthContext";
import {
  fetchNotifications,
  markNotificationRead,
  markAllRead,
} from "../services/notificationService";
import { Button } from "react-bootstrap";

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
      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "rgba(255, 255, 255, 0.06)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          position: "relative",
          cursor: "pointer",
          transition: "all 0.2s ease"
        }}
        className="hover-scale"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span style={{
            position: "absolute",
            top: "-2px",
            right: "-2px",
            background: "var(--danger-color)",
            color: "#fff",
            fontSize: "10px",
            fontWeight: "700",
            borderRadius: "50%",
            minWidth: "18px",
            height: "18px",
            padding: "2px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 8px rgba(239, 68, 68, 0.6)"
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          className="glass-panel notification-dropdown"
          style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            right: 0,
            padding: "16px",
            width: "320px",
            maxHeight: "440px",
            overflowY: "auto",
            zIndex: 1000,
            border: "1px solid var(--card-border)",
            borderRadius: "12px",
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)"
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 style={{ fontWeight: "700", margin: 0, color: "#fff" }}>Notifications</h6>
            {unreadCount > 0 && (
              <Button
                variant="link"
                size="sm"
                style={{ padding: 0, fontSize: "12px", color: "var(--primary-color)", textDecoration: "none", fontWeight: "600" }}
                onClick={() => {
                  markAllRead(user._id);
                  setNotifications((prev) =>
                    prev.map((n) => ({ ...n, read: true }))
                  );
                }}
              >
                Mark all read
              </Button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-4 text-muted" style={{ fontSize: "13px" }}>
              No notifications yet.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {notifications.map((n) => (
                <div
                  key={n._id || Math.random()}
                  style={{
                    background: n.read ? "transparent" : "rgba(59, 130, 246, 0.05)",
                    borderLeft: n.read ? "2px solid transparent" : "2px solid var(--primary-color)",
                    padding: "10px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = n.read ? "transparent" : "rgba(59, 130, 246, 0.05)"; }}
                  onClick={async () => {
                    if (n._id) {
                      await markNotificationRead(n._id);
                      setNotifications((prev) =>
                        prev.map((p) =>
                          p._id === n._id ? { ...p, read: true } : p
                        )
                      );
                    }
                    setOpen(false);
                    if (n.data && n.data.issueId) {
                      window.location.href = `/issues/${n.data.issueId}`;
                    }
                  }}
                >
                  <div style={{ fontWeight: n.read ? "600" : "700", color: n.read ? "#cbd5e1" : "#fff", fontSize: "14px" }}>
                    {n.title || "Notification"}
                  </div>
                  <div style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "4px", lineClamp: 2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {n.message || ""}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.25)", fontSize: "11px", marginTop: "6px" }}>
                    {n.createdAt ? new Date(n.createdAt).toLocaleTimeString() : ""}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
