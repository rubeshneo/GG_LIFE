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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();


app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Server running and DB connected");
});


const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  socket.on("userOnline", (userData) => {
    // Avoid duplicates
    if (!onlineUsers.some(u => u.userId === userData.userId)) {
      onlineUsers.push({ ...userData, socketId: socket.id });
    }
    // Broadcast updated list to everyone
    io.emit("onlineUsers", onlineUsers);
  });

  socket.on("privateMessage", (data) => {
    const { receiverId } = data;
    const receiver = onlineUsers.find((user) => user.userId === receiverId);

    if (receiver) {
      io.to(receiver.socketId).emit("receiveMessage", {
        senderId: data.senderId,
        text: data.text,
        time: data.time,
      });
    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("onlineUsers", onlineUsers);
    console.log("Client disconnected", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
