import express from "express";
import {
  getSummary,
  getCategoryWise,
  getMonthly
} from "../controllers/dashboard.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/summary", verifyToken, getSummary);
router.get("/category", verifyToken, getCategoryWise);
router.get("/monthly", verifyToken, getMonthly);

export default router;