import mongoose from "mongoose";
import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";

// Add a new product
const addProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.fields;

    // Validation for required fields
    if (!name || !brand || !description || !price || !category || !quantity) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const product = new Product({ ...req.fields });
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
// const updateProductDetails = asyncHandler(async (req, res) => {
//   try {
//     //const { name, description, price, category, quantity, brand } = req.fields;
//     //const { name, description, price, category, quantity, brand } = req.body;

//     // // Validation
//     // if (!name || !brand || !description || !price || !category || !quantity) {
//     //   return res.status(400).json({ error: "All fields are required" });
//     // }

//     // const updateData = { name, description, price, category, quantity, brand };
//     // if (req.file) {
//     //   updateData.image = `/${req.file.path.replace(/\\/g, "/")}`;
//     // }

//     // const product = await Product.findByIdAndUpdate(
//     //   req.params.productId,
//     //   updateData,
//     //   // { ...req.fields },
//     //   { new: true }
//     // );

//     // if (!product) {
//     //   return res.status(404).json({ error: "Product not found" });
//     // }

//     const { productId } = req.params;

//     const { name, description, price, category, quantity, brand } = req.fields;
//     const { image } = req.files;

//     if (!name || !brand || !description || !price || !category || !quantity) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     if (!productId) {
//       return res.status(400).json({ error: "Product ID is required" });
//     }

//     // const updatedFields = req.body; // Use req.body if parsed correctly
//     // const product = await Product.findByIdAndUpdate(
//     //   productId,
//     //   updatedFields,
//     //   { new: true } // Return updated product
//     // );
//     const updateData = {
//       name,
//       description,
//       price,
//       category,
//       quantity,
//       brand,
//     };

//     // If an image is provided, handle the file and update the path
//     if (image) {
//       const imagePath = `/uploads/${image.newFilename}`;
//       updateData.image = imagePath;
//     }

//     const product = await Product.findByIdAndUpdate(productId, updateData, {
//       new: true,
//     });

//     if (!product) {
//       return res.status(404).json({ error: "Product not found" });
//     }

//     await product.save();

//     res.json(product);
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ error: error.message });
//   }
// });
const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const updatedFields = { ...req.body };

    // Check for an uploaded file
    if (req.file) {
      updatedFields.image = `/${req.file.path.replace(/\\/g, "/")}`; // Set the file path
    }
    if (!req.file && req.body.existingImage) {
      updatedFields.image = req.body.existingImage;
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      updatedFields,
      { new: true } // Return the updated product
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    console.log("File:", req.file);
    console.log("Body:", req.body);

    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Update failed", message: error.message });
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
