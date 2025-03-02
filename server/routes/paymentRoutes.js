import express from "express";

import {
  createStripePayment,
  stripeWebhook,
} from "../controllers/paymentController.js";

import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create-payment-intent", authenticate, createStripePayment);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

export default router;
