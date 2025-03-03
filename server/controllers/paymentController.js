// controllers/paymentController.js
import {
  createCheckoutSession,
  createPaymentIntent,
  handleWebhook,
} from "../config/stripe.js";
import Order from "../models/orderModel.js";
import { createWebhookOrder } from "../utils/webhook.js";

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

// New Checkout Session Controller
export const createStripeCheckout = async (req, res) => {
  try {
    const { userId, cartItems } = req.body;

    if (!userId || !cartItems || cartItems.length === 0) {
      return res
        .status(400)
        .json({ error: "User ID and cart items are required" });
    }

    const customerData = {
      metadata: {
        userId,
        cart: JSON.stringify(cartItems),
      },
    };

    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [item.image],
          description: item.description || "No description",
          metadata: { id: item._id },
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
      //quantity: item.cartQuantity,
    }));

    const session = await createCheckoutSession(
      customerData,
      lineItems,
      `${process.env.CLIENT_URL}/checkout-success`,
      `${process.env.CLIENT_URL}/cart`
    );

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const stripeWebhook = async (req, res) => {
  let event;

  try {
    event = await handleWebhook(req.body, req.headers["stripe-signature"]);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle order creation on checkout session completion
  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object;
      const customer = await stripe.customers.retrieve(session.customer);
      await createWebhookOrder(customer, session);
    } catch (err) {
      console.error("Order processing failed:", err);
    }
  }

  // Handle payment update when the payment intent succeeds
  if (event.type === "payment_intent.succeeded") {
    try {
      const paymentIntent = event.data.object;
      await Order.findOneAndUpdate(
        { "paymentResult.id": paymentIntent.id },
        {
          isPaid: true,
          paidAt: Date.now(),
          "paymentResult.status": paymentIntent.status,
          "paymentResult.update_time": new Date(), // use current time or adjust as needed
          "paymentResult.email_address": paymentIntent.receipt_email,
          "paymentResult.created": new Date(paymentIntent.created * 1000),
        },
        { new: true }
      );
    } catch (err) {
      console.error("Payment update failed:", err);
    }
  }

  res.status(200).end();
};
