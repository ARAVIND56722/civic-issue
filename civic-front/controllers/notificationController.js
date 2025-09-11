// controllers/notificationController.js
const Notification = require('../models/Notification');


exports.createNotification = async ({ userId, title, message, type = 'info', data = {}}, io) => {
const n = await Notification.create({ userId, title, message, type, data });
// emit to user's room
if (io) io.to(`user_${userId}`).emit('notification', n);
return n;
};


exports.getUserNotifications = async (req, res) => {
const { userId } = req.params;
const { unreadOnly } = req.query;
const q = { userId };
if (unreadOnly === 'true') q.read = false;
const list = await Notification.find(q).sort({ createdAt: -1 }).limit(100);
res.json(list);
};


exports.markAsRead = async (req, res) => {
const { id } = req.params;
const n = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
res.json(n);
};


exports.markAllRead = async (req, res) => {
const { userId } = req.params;
await Notification.updateMany({ userId }, { read: true });
res.json({ ok: true });
};