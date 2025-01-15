import express from "express";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

import {
  deleteUserById,
  getAllUsers,
  getCurrentUserProfile,
  getUserById,
  updateCurrentUserProfile,
  updateUserById,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/get-all-users", authenticate, authorizeAdmin, getAllUsers);

router.get("/get-profile", authenticate, getCurrentUserProfile);

router.put("/update-profile", authenticate, updateCurrentUserProfile);

router.get("/get-all-users", authenticate, authorizeAdmin, getAllUsers);

router.get("/get-user/:id", authenticate, authorizeAdmin, getUserById);

router.put("/update-user/:id", authenticate, authorizeAdmin, updateUserById);

router.delete("/delete-user/:id", authenticate, authorizeAdmin, deleteUserById);

export default router;
