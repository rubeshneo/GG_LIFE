import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authroutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import { createServer } from "http";
import { Server } from "socket.io";
import Message from "./models/Message.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Server running and DB connected");
});

// Error handler
app.use(errorHandler);

// Create HTTP server
const httpServer = createServer(app);

// Create Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

// Store online users
let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // User comes online
  socket.on("userOnline", (userData) => {
    const userId = userData.id || userData._id || userData.userId;

    if (userId && !onlineUsers.some((u) => u.userId === userId)) {
      onlineUsers.push({
        ...userData,
        userId,
        socketId: socket.id,
      });
    }

    io.emit("onlineUsers", onlineUsers);
  });

  // Private message (SAVE + EMIT)
  socket.on("privateMessage", async (data) => {
    try {
      const { senderId, receiverId, text, time } = data;

      // Save message to DB
      const newMessage = await Message.create({
        senderId,
        receiverId,
        text,
      });

      // Find receiver in online list
      const receiver = onlineUsers.find(
        (user) => user.userId === receiverId
      );

      // If receiver is online, send message
      if (receiver) {
        io.to(receiver.socketId).emit("receiveMessage", {
          ...newMessage._doc,
          time: time || new Date(),
        });
      }

    } catch (error) {
      console.error("Error handling privateMessage:", error);
    }
  });

  // Disconnect
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter(
      (user) => user.socketId !== socket.id
    );

    io.emit("onlineUsers", onlineUsers);
    console.log("Client disconnected:", socket.id);
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
