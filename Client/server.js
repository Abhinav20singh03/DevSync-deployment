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

// ✅ Fix Content Security Policy (CSP)
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src *; font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;");
    next();
});

// ✅ Serve Frontend Build
const buildPath = path.join(__dirname, "frontend", "dist");
app.use(express.static(buildPath));

// ✅ Redirect all unknown routes to index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
});

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

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
