import express from "express";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

import {
  createCategory,
  getAllCategories,
  getCategory,
  removeCategory,
  updateCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/create-category", authenticate, authorizeAdmin, createCategory);

router.put(
  "/update-category/:categoryId",
  authenticate,
  authorizeAdmin,
  updateCategory
);

router.delete(
  "/delete-category/:categoryId",
  authenticate,
  authorizeAdmin,
  removeCategory
);

router.get("/fetch-categories", getAllCategories);

router.get("/get-category/:categoryId", getCategory);

export default router;
