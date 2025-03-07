import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: "*", credentials: true }));

const __dirname = path.resolve();

const buildPath = path.join(__dirname, "dist");


app.use(express.static(buildPath));

app.get("*", (req, res) => {
    const indexPath = path.join(buildPath, "index.html");
    console.log("Serving index.html from:", indexPath); // Debugging log
    res.sendFile(indexPath);
});

// ✅ WebSocket Handling
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

io.on("connection", (socket) => {
  console.log(`✅ WebSocket Connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`❌ User Disconnected: ${socket.id}`);
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
