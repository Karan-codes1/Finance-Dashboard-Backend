import express from "express";
import { verifyToken, allowRoles } from "../middleware/auth.middleware.js";
import {
  getUsers,
  updateUserRole,
  toggleUserStatus,
  deleteUser
} from "../controllers/user.controller.js"; 

const router = express.Router();

// get all users (admin only)
router.get("/", verifyToken, allowRoles("admin"), getUsers);

// update role
router.patch("/:id/role", verifyToken, allowRoles("admin"), updateUserRole);

// toggle active/inactive
router.patch("/:id/status", verifyToken, allowRoles("admin"), toggleUserStatus);

// soft delete user (admin only)
router.delete("/:id", verifyToken, allowRoles("admin"), deleteUser);

export default router;