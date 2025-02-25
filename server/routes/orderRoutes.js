import express from "express";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

import {
  calculateTotalSales,
  calculateTotalSalesByDate,
  countTotalOrders,
  createOrder,
  findOrderById,
  getAllOrders,
  getUserOrders,
  markOrderAsDelivered,
  markOrderAsPaid,
} from "../controllers/orderController.js";

const router = express.Router();

router.get("/fetch-all-orders", authenticate, authorizeAdmin, getAllOrders);

router.get("/get-user-orders", authenticate, getUserOrders);

router.get("/total-sales", calculateTotalSales);

router.get("/total-orders", countTotalOrders);

router.get("/total-sales-by-date", calculateTotalSalesByDate);

router.get("/get-order/:id", authenticate, findOrderById);

router.post("/create-order", authenticate, createOrder);

router.put("/get-order/:id/pay", authenticate, markOrderAsPaid);

router.put(
  "/get-order/:id/deliver",
  authenticate,
  authorizeAdmin,
  markOrderAsDelivered
);

export default router;
