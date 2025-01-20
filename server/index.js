// Packages
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

// Utilities
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
// import orderRoutes from "./routes/orderRoutes.js";
import { errorHandler, notFound } from "./middlewares/errorNotFound.js";

dotenv.config();
const port = process.env.PORT_NUMBER || 4200;

// Database Connection
connectDB();

const app = express();

// Middleware
app.use(helmet()); // Secure HTTP headers

app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true, // Allow cookies
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
); // Configure CORS

app.use(morgan("dev")); // Logging requests
app.use(express.json({ limit: "20mb" })); // Limit JSON payload size
//app.use(express.json());
//app.use(express.urlencoded({ extended: true })); // Limit URL-encoded payload size
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/media", uploadRoutes);
// app.use("/api/v1/orders", orderRoutes);

// app.get("/api/v1/config/paypal", (req, res) => {
//   res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
// });

// Static Files
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start Server
app.listen(port, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port: ${port}, and listening to requests at http://localhost:${port}`
  );
});
