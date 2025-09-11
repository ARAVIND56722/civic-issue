// src/services/notificationService.js
const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

export async function fetchNotifications(userId) {
  const res = await fetch(`${API}/api/notifications/${userId}`);
  return res.json();
}

export async function markNotificationRead(id) {
  const res = await fetch(`${API}/api/notifications/${id}/read`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" }
  });
  return res.json();
}

export async function markAllRead(userId) {
  const res = await fetch(`${API}/api/notifications/mark-all/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" }
  });
  return res.json();
}
