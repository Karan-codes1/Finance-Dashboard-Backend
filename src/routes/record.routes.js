import express from "express";
import {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord,
} from "../controllers/record.controller.js";

import { verifyToken, allowRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

// create (admin only)
router.post("/", verifyToken, allowRoles("admin"), createRecord);

// read (all roles)
router.get("/", verifyToken, getRecords);

// update/delete (admin only)
router.patch("/:id", verifyToken, allowRoles("admin"), updateRecord);
router.delete("/:id", verifyToken, allowRoles("admin"), deleteRecord);

export default router;