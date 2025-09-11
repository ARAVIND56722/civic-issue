require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const cors = require("cors");
app.use(cors()); // allow all origins during development

// Middleware to parse JSON requests
app.use(express.json());

// 👉 Import your issue routes
const issueRoutes = require("./routes/issueRoutes");
app.use("/api/issues", issueRoutes);

// 👉 ✅ Import your notifications routes (ADD THIS)
const notificationsRouter = require("./routes/notifications");
app.use("/api/notifications", notificationsRouter);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Simple test route
app.get("/", (req, res) => {
    res.send("Crowdsourced Civic Issue Reporting API is running...");
});

// Start the server
const http = require("http");
const { Server } = require("socket.io");

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("🔌 New client connected:", socket.id);

  // ✅ Register user and join personal room
  socket.on("register", ({ userId }) => {
    socket.join(`user_${userId}`);
    console.log(`➡️ socket ${socket.id} joined room user_${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Make io available inside routes
app.set("io", io);

// Start the server (⚡ use server.listen instead of app.listen)
const PORT = process.env.PORT || 5000;
// 👉 Test notification route
app.get("/test-notify/:userId", (req, res) => {
  const { userId } = req.params;

  // Send a fake event to the user’s room
  const io = req.app.get("io");
  io.to(`user_${userId}`).emit("issueStatusUpdated", {
    issueId: "demo123",
    status: "In Progress",
  });

  res.json({ message: `Notification sent to user_${userId}` });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
