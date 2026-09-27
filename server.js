import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import connectDB from "./config/db.js";
import { initSocket } from "./config/socket.js";
import menuRoutes from "./routes/menuRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/menu", menuRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 5000;

// Wrap the Express app in a plain Node HTTP server —
// Socket.io needs this raw server to attach itself to, since
// app.listen() alone doesn't expose the underlying server object.
const httpServer = createServer(app);
initSocket(httpServer);

if (process.env.MONGO_URI) {
  connectDB().then(() => {
    httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
} else {
  console.log("MONGO_URI not set — starting server without DB connection.");
  httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}