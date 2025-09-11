// routes/notifications.js
const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// ✅ Get all notifications for a user
router.get("/:userId", async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Mark a single notification as read
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

// ✅ Mark all notifications as read for a user
router.put("/mark-all/:userId", async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.params.userId, read: false },
      { $set: { read: true } }
    );
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Create a new notification manually
router.post("/", async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    const io = req.app.get("io");

    // emit notification to specific user
    io.to(`user_${req.body.userId}`).emit("notification", notification);

    res.status(201).json(notification);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Test notification route
router.get("/test-notify/:userId", (req, res) => {
  const io = req.app.get("io");
  const { userId } = req.params;

  // emit a fake notification
  io.to(`user_${userId}`).emit("notification", {
    message: `Hello user ${userId}, this is a test notification!`,
    userId,
    createdAt: new Date(),
  });

  console.log(`📤 Sent test notification to user_${userId}`);
  res.json({ message: `Notification sent to user_${userId}` });
});

module.exports = router;
