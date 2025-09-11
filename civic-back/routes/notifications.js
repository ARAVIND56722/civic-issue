const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification"); // make sure this model exists

// 👉 Get all notifications for a user
router.get("/:userId", async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 👉 Mark one notification as read
router.put("/:id/read", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 👉 Mark all notifications for a user as read
router.put("/mark-all/:userId", async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.params.userId, read: false },
      { $set: { read: true } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 👉 Create a new notification + emit via Socket.IO
router.post("/", async (req, res) => {
  try {
    const { userId, message } = req.body;

    // Save to DB
    const notification = await Notification.create({ userId, message });

    // 🔥 Emit real-time notification
    const io = req.app.get("io"); // fetch io from app
    io.to(`user_${userId}`).emit("notification", notification);

    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
