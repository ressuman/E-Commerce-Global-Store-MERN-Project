import mongoose from "mongoose";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import { calcPrices } from "../utils/calcPrices.js";

const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ error: "No order items" });
    }

    // Validate product IDs
    const productIds = orderItems.map((item) => {
      if (!item.product || !mongoose.Types.ObjectId.isValid(item.product)) {
        throw new Error(`Invalid product ID: ${item.product}`);
      }
      return item.product;
    });

    const itemsFromDB = await Product.find({ _id: { $in: productIds } });

    const country = shippingAddress.country.toUpperCase();

    const dbOrderItems = await Promise.all(
      orderItems.map(async (itemFromClient) => {
        const matchingItemFromDB = itemsFromDB.find(
          (item) => item._id.toString() === itemFromClient.product
        );

        if (!matchingItemFromDB) {
          throw new Error(`Product not found: ${itemFromClient.product}`);
        }

        if (matchingItemFromDB.countInStock < itemFromClient.qty) {
          throw new Error(
            `Insufficient stock for ${matchingItemFromDB.name} (${itemFromClient.qty} requested)`
          );
        }
        return {
          name: matchingItemFromDB.name,
          qty: itemFromClient.qty,
          image: matchingItemFromDB.image,
          price: matchingItemFromDB.price,
          product: matchingItemFromDB._id,
        };
      })
    );

    // Update product stock
    const bulkOps = dbOrderItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { countInStock: -item.qty } },
      },
    }));

    await Product.bulkWrite(bulkOps);

    const prices = calcPrices(dbOrderItems, country);

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      currency: "usd",
      ...prices,
      taxRate: prices.taxRate,
      subtotal: prices.subtotal,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    // const page = parseInt(req.query.page) || 1;
    // const limit = parseInt(req.query.limit) || 20;
    // const skip = (page - 1) * limit;

    const orders = await Order.find({})
      // .skip(skip)
      // .limit(limit)
      .populate("user", "id username email")
      .sort("-createdAt");

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found" });
    }

    const count = await Order.countDocuments();

    res.json({ count, countLength: orders.length, orders });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort("-createdAt");

    res.json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

const countTotalOrders = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.json({ totalOrders });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

const calculateTotalSales = async (req, res) => {
  try {
    const result = await Order.aggregate([
      {
        $match: { isPaid: true },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalPrice" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    const totalSales = result[0]?.totalSales || 0;
    const totalOrders = result[0]?.totalOrders || 0;

    res.json({ totalSales: Number(totalSales.toFixed(2)), totalOrders });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

const calculateTotalSalesByDate = async (req, res) => {
  try {
    const salesByDate = await Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$paidAt",
              timezone: "UTC",
            },
          },
          totalSales: { $sum: "$totalPrice" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(salesByDate);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

const findOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "username email")
      .populate("orderItems.product", "name image");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

const markOrderAsPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.isPaid) {
      return res.status(400).json({ error: "Order already paid" });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer?.email_address || "",
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

const markOrderAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.isDelivered) {
      return res.status(400).json({ error: "Order already delivered" });
    }

    if (!order.isPaid) {
      return res
        .status(400)
        .json({ error: "Order must be paid before delivery" });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

export {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calculateTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
};
