const Notification = require("../models/Notification");

// Reusable function to create + emit a notification
exports.createNotification = async (data, io) => {
  try {
    // 1. Save notification in DB
    const notification = await Notification.create({
      userId: data.userId,
      title: data.title,
      message: data.message,
      type: data.type || "general",
      data: data.data || {},
    });

    // 2. Emit in real-time via socket.io
    io.to(`user_${data.userId}`).emit("notification", notification);

    return notification;
  } catch (err) {
    console.error("❌ Error creating notification:", err);
  }
};
