// models/Notification.js 
const mongoose = require('mongoose'); 
const NotificationSchema = new mongoose.Schema({
 userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
 title: { type: String, required: true },
 message: { type: String },
 type: { type: String }, // e.g. 'status_update', 'assignment' 
 data: { type: Object }, // any extra payload (e.g. { issueId })
 read: { type: Boolean, default: false }, 
 createdAt: { type: Date, default: Date.now } 

});


 module.exports = mongoose.model('Notification', NotificationSchema);