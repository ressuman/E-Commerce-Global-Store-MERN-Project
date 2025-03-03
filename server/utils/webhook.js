import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import { calcPrices } from "./calcPrices.js";

// Helper function to create orders from webhook
export const createWebhookOrder = async (customer, session) => {
  try {
    // 1. Parse cart items from customer metadata
    const items = JSON.parse(customer.metadata.cart);

    // 2. Retrieve up-to-date product details from DB
    const productIds = items.map((item) => item._id);
    const products = await Product.find({ _id: { $in: productIds } });

    // 3. Build order items with complete product data
    const orderItems = items.map((item) => {
      const product = products.find((p) => p._id.toString() === item.id);
      if (!product) {
        throw new Error(`Product ${item.id} not found`);
      }

      return {
        product: product._id,
        name: product.name,
        qty: item.qty,
        // qty: item.cartQuantity,
        image: product.image,
        price: product.price,
      };
    });

    // 4. Calculate pricing details using your existing calcPrices utility
    const prices = calcPrices(orderItems); // Expected keys: itemsPrice, taxPrice, shippingPrice, totalPrice, subtotal

    // 5. Build order data matching your order model
    const orderData = {
      user: customer.metadata.userId,
      orderItems,
      shippingAddress: {
        address: session.customer_details.address?.line1 || "",
        city: session.customer_details.address?.city || "",
        postalCode: session.customer_details.address?.postal_code || "",
        country: session.customer_details.address?.country || "",
      },
      paymentMethod: "Stripe",
      paymentResult: {
        id: session.payment_intent,
        status: session.payment_status,
        update_time: new Date(), // Adjust if a more precise timestamp is available
        email_address: session.customer_details.email,
        created: new Date(session.created * 1000),
      },
      currency: "usd",
      itemsPrice: prices.itemsPrice,
      taxPrice: prices.taxPrice,
      shippingPrice: prices.shippingPrice,
      totalPrice: prices.totalPrice,
      isPaid: session.payment_status === "paid",
      paidAt: session.payment_status === "paid" ? new Date() : null,
      customerId: session.customer,
      paymentIntentId: session.payment_intent,
      //subtotal: prices.subtotal,
      subtotal: prices.itemsPrice,
      payment_status: session.payment_status,
      isDelivered: false,
    };

    // 6. Create and save the new order
    const order = new Order(orderData);
    const savedOrder = await order.save();
    console.log("Webhook order created:", savedOrder._id);

    // 7. Update product stock based on ordered quantities
    const bulkOps = orderItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { countInStock: -item.qty } },
      },
    }));
    await Product.bulkWrite(bulkOps);

    return savedOrder;
  } catch (error) {
    console.error("Webhook order creation failed:", error);
    throw error;
  }
};
