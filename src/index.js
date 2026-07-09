import express from "express";
import dotenv from "dotenv";


import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import { connectDB } from './models/db.js';
import { verifyToken, allowRoles } from "./middleware/auth.middleware.js";
import recordRoutes from "./routes/record.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import userRoutes from "./routes/user.routes.js";

import { apiLimiter } from "./middleware/rateLimiter.middleware.js";
import { authLimiter } from "./middleware/rateLimiter.middleware.js";


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api", apiLimiter);
app.use("/api/auth", authLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);

const PORT = 5001;
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();