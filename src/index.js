import express from "express";
import dotenv from "dotenv";

import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import { connectDB } from './models/db.js';
import { verifyToken, allowRoles } from "./middleware/auth.middleware.js";
import recordRoutes from "./routes/record.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";



dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


await connectDB();


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});


// app.get("/api/test-admin", verifyToken, allowRoles("admin"), (req, res) => {
//   res.json({ message: "Welcome Admin" });
// });

const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});