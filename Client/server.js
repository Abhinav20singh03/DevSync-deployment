import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: "*", credentials: true }));

// ✅ Fix Static File Serving
const buildPath = path.resolve(__dirname, "./Client/dist"); // FIXED PATH
console.log("Serving frontend from:", buildPath);

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
