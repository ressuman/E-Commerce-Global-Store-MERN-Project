// config/stripe.js
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY, {
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

// Checkout Session Functions
export const createCheckoutSession = async (
  customerData,
  lineItems,
  successUrl,
  cancelUrl
) => {
  const customer = await stripe.customers.create(customerData);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "KE", "GH", "NG", "GB", "ZA", "AU", "IN"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: 0, currency: "usd" },
          display_name: "Free shipping",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 5 },
            maximum: { unit: "business_day", value: 7 },
          },
        },
      },
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: 1500, currency: "usd" },
          display_name: "Next day air",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 1 },
            maximum: { unit: "business_day", value: 1 },
          },
        },
      },
    ],
    phone_number_collection: { enabled: true },
    automatic_tax: { enabled: true },
    line_items: lineItems,
    mode: "payment",
    customer: customer.id,
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return session;
};

export default stripe;
