const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const http = require("http");
const socketIo = require("socket.io");
const corsOptions = require("./config/corsOptions");
const client = require("./config/db");

// Import routes
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const ordersRoutes = require("./routes/orders");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: corsOptions.origin,
    methods: corsOptions.methods,
  },
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin" },
    crossOriginEmbedderPolicy: { policy: "require-corp" },
  })
);

// Socket.io for real-time updates
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join a room for order updates
  socket.on("join-order-room", (orderId) => {
    socket.join(orderId);
    console.log(`Socket ${socket.id} joined room for order ${orderId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Make io accessible to our routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/orders", ordersRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: "Internal server error" });
});

module.exports = { app: server, client, io };
