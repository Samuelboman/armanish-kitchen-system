import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import menuRoutes from "./routes/menuRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/menu", menuRoutes);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB, then start the server.
// If MONGO_URI isn't set yet, the server still starts so you can verify
// the environment setup before wiring up the database in Task 2/3.
if (process.env.MONGO_URI) {
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
} else {
  console.log("MONGO_URI not set — starting server without DB connection.");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
