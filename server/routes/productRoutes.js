import express from "express";
import formidable from "express-formidable";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

import {
  addProduct,
  addProductReview,
  fetchAllProducts,
  fetchNewProducts,
  fetchPaginatedProducts,
  fetchProductById,
  fetchTopProducts,
  filterProducts,
  removeProduct,
  updateProductDetails,
} from "../controllers/productController.js";

import checkId from "../middlewares/checkId.js";

const router = express.Router();

router.get("/fetch-products/search", fetchPaginatedProducts);

router.get("/get-all-products", fetchAllProducts);

router.get("/fetch-new-products", fetchNewProducts);

router.get("/get-top-products", fetchTopProducts);

router.get("/get-product/:productId", fetchProductById);

router.post(
  "/add-product",
  authenticate,
  authorizeAdmin,
  formidable(),
  addProduct
);

router.post(
  "/add-review/:productId/reviews",
  authenticate,
  checkId,
  addProductReview
);

router.post("/get-filtered-products", filterProducts);

router.put(
  "/update-product/:productId",
  authenticate,
  authorizeAdmin,
  formidable(),
  updateProductDetails
);

router.delete(
  "/delete-product/:productId",
  authenticate,
  authorizeAdmin,
  removeProduct
);

export default router;
