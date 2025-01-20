import mongoose from "mongoose";
import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";

// Add a new product
const addProduct = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      quantity,
      brand,
      countInStock,
    } = req.fields;

    // Validation
    // Validation for required fields
    if (!name || !brand || !description || !price || !category || !quantity) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate numeric fields
    const priceValue = parseFloat(price);
    const quantityValue = parseInt(quantity, 10);
    const countInStockValue = parseInt(countInStock || 0, 10);

    if (isNaN(priceValue) || priceValue < 0) {
      return res.status(400).json({ error: "Invalid price" });
    }
    if (isNaN(quantityValue) || quantityValue < 0) {
      return res.status(400).json({ error: "Invalid quantity" });
    }
    if (isNaN(countInStockValue) || countInStockValue < 0) {
      return res.status(400).json({ error: "Invalid count in stock" });
    }

    // Validate category ObjectId format
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ error: "Invalid category ID format" });
    }

    // Validate category existence
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    // Handle image (placeholder logic, replace with actual file upload handling)
    const image = req.files?.image || "default-image.jpg";

    const product = new Product({
      name,
      description,
      price: priceValue,
      category,
      quantity: quantityValue,
      brand,
      countInStock: countInStockValue,
      image,
    });
    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to add product", message: error.message });
  }
});

// Update product details
const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      quantity,
      brand,
      countInStock,
    } = req.fields;

    // Validation
    if (!name || !brand || !description || !price || !category || !quantity) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const priceValue = parseFloat(price);
    const quantityValue = parseInt(quantity, 10);
    const countInStockValue = parseInt(
      countInStock || product.countInStock,
      10
    );

    if (isNaN(priceValue) || priceValue < 0) {
      return res.status(400).json({ error: "Invalid price" });
    }
    if (isNaN(quantityValue) || quantityValue < 0) {
      return res.status(400).json({ error: "Invalid quantity" });
    }
    if (isNaN(countInStockValue) || countInStockValue < 0) {
      return res.status(400).json({ error: "Invalid count in stock" });
    }

    // Validate category ObjectId format
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ error: "Invalid category ID format" });
    }

    // Validate category existence
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    // Handle image update (placeholder logic, replace with actual file upload handling)
    const image = req.files?.image || product.image;

    Object.assign(product, {
      name,
      description,
      price: priceValue,
      category,
      quantity: quantityValue,
      brand,
      countInStock: countInStockValue,
      image,
    });
    await product.save();

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

// Remove a product
const removeProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product removed successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Fetch products with pagination and search
const fetchPaginatedProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 6; // Default items per page: 6
    const page = Number(req.query.page) || 1; // Default page: 1

    // Keyword search
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword, // Matches keyword in the `name` field
            $options: "i", // Case-insensitive
          },
        }
      : {};

    // Count total matching documents
    const totalProducts = await Product.countDocuments({ ...keyword });

    // Fetch paginated products
    const products = await Product.find({ ...keyword })
      .limit(pageSize) // Restrict to the current page size
      .skip(pageSize * (page - 1)) // Skip products from previous pages
      .sort({ createdAt: -1 }); // Sort by newest first

    res.json({
      products,
      totalProducts,
      page,
      pages: Math.ceil(totalProducts / pageSize),
      hasMore: page < Math.ceil(totalProducts / pageSize),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Fetch product by ID
const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).populate(
      "category",
      "name"
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Product not found" });
  }
});

// Fetch all products
const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category", "name")
      .limit(12)
      .sort({ createdAt: -1 });

    if (!products.length) {
      return res.status(404).json({ error: "No products found" });
    }

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Add a product review
const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;

    // Validate input
    if (!rating || !comment) {
      return res.status(400).json({ error: "Rating and comment are required" });
    }

    // Fetch the product
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if the user has already reviewed the product
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ error: "You have already reviewed this product" });
    }

    // Create a new review
    const review = {
      name: req.user.username || req.user.name,
      rating: Number(rating),
      comment: comment.trim(),
      user: req.user._id,
    };

    // Add review to the product
    product.reviews.push(review);

    // Update product rating and review count
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    // Save the product
    await product.save();
    res.status(201).json({ message: "Review added" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

// Fetch top-rated products
const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

// Fetch newly added products
const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

// Filter products by category and price range
// const filterProducts = asyncHandler(async (req, res) => {
//   try {
//     const { checked, radio } = req.body;

//     const args = {};
//     if (checked.length > 0) args.category = checked;
//     if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

//     const products = await Product.find(args);
//     res.json(products);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server Error" });
//   }
// });
const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { checked = [], radio = [] } = req.body;

    // Build the filter object
    const filter = {};
    if (checked.length > 0) {
      // Ensure `checked` contains valid MongoDB ObjectId references
      filter.category = {
        $in: checked.map((id) => mongoose.Types.ObjectId(id)),
      };
    }
    if (radio.length === 2) {
      filter.price = { $gte: radio[0], $lte: radio[1] }; // Match price range
    }

    // Fetch products matching the filter
    const filteredProducts = await Product.find(filter).populate(
      "category",
      "name"
    );

    res.status(200).json(filteredProducts);
  } catch (error) {
    console.error(`Error filtering products: ${error.message}`);
    res
      .status(500)
      .json({ error: "Failed to filter products", message: error.message });
  }
});

export {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchPaginatedProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
};
