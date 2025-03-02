// controllers/paymentController.js
import { createPaymentIntent, handleWebhook } from "../config/stripe.js";
import Order from "../models/orderModel.js";

export const createStripePayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
    }).select("totalPrice paymentMethod isPaid currency");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.isPaid) {
      return res.status(400).json({ error: "Order already paid" });
    }

    // // Ghanaian currency validation
    // if (order.currency !== "ghs") {
    //   return res
    //     .status(400)
    //     .json({ error: "Invalid currency for Ghanaian transactions" });
    // }

    // Create payment intent with 3D Secure requirement
    const paymentIntent = await createPaymentIntent(order);

    // Update order with payment intent ID
    await Order.findByIdAndUpdate(orderId, {
      "paymentResult.id": paymentIntent.id,
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: paymentIntent.id,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      code: error.code || "PAYMENT_ERROR",
    });
  }
};

export const stripeWebhook = async (req, res) => {
  try {
    const event = await handleWebhook(
      req.body,
      req.headers["stripe-signature"]
    );

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;

      await Order.findOneAndUpdate(
        { "paymentResult.id": paymentIntent.id },
        {
          isPaid: true,
          paidAt: Date.now(),
          "paymentResult.status": paymentIntent.status,
          "paymentResult.email_address": paymentIntent.receipt_email,
          "paymentResult.created": new Date(paymentIntent.created * 1000),
        },
        { new: true }
      );
    }

    res.status(200).json({ received: true });
  } catch (error) {
    res.status(400).json({ error: `Webhook Error: ${error.message}` });
  }
};
