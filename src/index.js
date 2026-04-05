import express from "express";
import dotenv from "dotenv";


import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import { connectDB } from './models/db.js';
import { verifyToken, allowRoles } from "./middleware/auth.middleware.js";
import recordRoutes from "./routes/record.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

import { apiLimiter } from "./middleware/rateLimiter.middleware.js";
import { authLimiter } from "./middleware/rateLimiter.middleware.js";


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api", apiLimiter);
app.use("/api/auth", authLimiter);

// Connect to DB
await connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Protected test route
// app.get("/api/test-admin", verifyToken, allowRoles("admin"), (req, res) => {
//   res.json({ message: "Welcome Admin" });
// });

const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});