// config/stripe.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
  typescript: true,
});

export const createPaymentIntent = async (order) => {
  return await stripe.paymentIntents.create({
    amount: Math.round(order.totalPrice * 100),
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      orderId: order._id.toString(),
    },
    receipt_email: order.user.email, // Ghanaian compliance
    description: `Payment for order ${order._id}`,
    payment_method_options: {
      card: {
        request_three_d_secure: "automatic",
      },
    },
  });
};

export const handleWebhook = async (payload, sig) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  try {
    return stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    throw new Error(`Webhook signature verification failed: ${err.message}`);
  }
};
