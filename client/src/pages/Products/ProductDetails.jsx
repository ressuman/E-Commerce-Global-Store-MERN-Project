import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  useAddProductReviewMutation,
  useGetProductByIdQuery,
} from "../../redux/api/productsAndUploadApiSlice";
import { toast } from "react-toastify";
import { Loader1 } from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBoxes,
  FaCalendarPlus,
  FaClock,
  FaComment,
  FaHistory,
  FaMinus,
  FaPlus,
  FaRegStar,
  FaStar,
  FaStarHalfAlt,
  FaStore,
  FaTags,
  FaWarehouse,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "../../components/HeartIcon";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { motion, AnimatePresence } from "framer-motion";
import ProductsTab from "./ProductsTab";
import { addToCart } from "../../redux/features/cart/cartSlice";

export default function ProductDetails() {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductByIdQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading: loadingProductReview }] =
    useAddProductReviewMutation();

  const formatRating = (rating) => {
    return rating % 1 === 0 ? rating.toFixed(0) : Math.ceil(rating).toFixed(0);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({ productId, rating, comment }).unwrap();
      refetch();
      // Clear the form fields after successful submission
      setRating(0);
      setComment("");
      toast.success("Review created successfully");
    } catch (error) {
      setRating(0);
      setComment("");
      // Modified error handling
      const errorMessage =
        error.data?.error || error.message || "Review submission failed";
      toast.error(errorMessage);
    }
  };

  const addToCartHandler = () => {
    if (!product || !product._id) {
      toast.error("Product information is missing");
      return;
    }

    if (product.countInStock < qty) {
      toast.error("Not enough stock available");
      return;
    }

    const cartItem = {
      ...product,
      qty,
    };

    dispatch(addToCart(cartItem));
    toast.success(`${qty} x ${product.name} added to cart!`);

    setTimeout(() => navigate("/cart"), 1000);
  };

  if (isLoading) {
    return <Loader1 />;
  }

  if (error) {
    return (
      <Message variant="error">{error?.data?.message || error.message}</Message>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="ml-[15%] mr-[2%] mt-6 ">
        <Link
          to="/"
          className="flex w-[8rem] items-center justify-between mb-16  bg-pink-100 hover:bg-pink-200 text-pink-800 px-4 py-2 rounded-lg shadow-md transition-all duration-200 z-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium uppercase">Go Back</span>
        </Link>
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-center">
          {/* Product Image Section */}
          <div className="lg:w-1/2 relative">
            <LazyLoadImage
              src={product.image}
              alt={product.name}
              className="w-[39rem] rounded-lg shadow-lg h-[35rem] object-cover"
              effect="blur"
              threshold={100}
            />
            <HeartIcon product={product} />
          </div>

          {/* Product Details Section */}
          <div className="lg:w-1/2 space-y-6">
            <h1 className="text-4xl font-bold text-white">{product.name}</h1>
            <p className="text-gray-300 text-lg">{product.description}</p>

            <div className="flex items-center justify-between">
              {/* Price Display */}
              <span className="text-3xl font-bold text-pink-500">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(product.price)}
              </span>

              {/* Combined Rating System */}
              <div className="flex items-center gap-4">
                {/* Numeric Rating & Reviews */}
                {/* Rating Section */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <FaStar className="text-yellow-400" />
                    <span className="text-gray-300">
                      {new Intl.NumberFormat("en-US", {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      }).format(product.rating)}
                    </span>
                  </div>
                  {/* Reviews Section */}
                  <div className="flex items-center gap-2">
                    <FaComment className="text-pink-500" />
                    <span className="text-gray-300">
                      {(() => {
                        if (product.numReviews === 0) {
                          return "No reviews";
                        }
                        if (product.numReviews === 1) {
                          return "1 review";
                        }
                        return `${product.numReviews} reviews`;
                      })()}
                    </span>
                  </div>
                </div>

                {/* Star Rating Component */}
                <div
                  className="flex items-center"
                  role="img"
                  aria-label={`Rating: ${product.rating} out of 5`}
                >
                  {[...Array(5)].map((_, index) => {
                    const starValue = index + 1;
                    const clampedValue = Math.min(
                      Math.max(product.rating, 0),
                      5
                    );

                    return (
                      <span key={index} className="ml-1">
                        {clampedValue >= starValue ? (
                          <FaStar className="text-yellow-400" />
                        ) : clampedValue >= starValue - 0.5 ? (
                          <FaStarHalfAlt className="text-yellow-400" />
                        ) : (
                          <FaRegStar className="text-gray-300" />
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Product Metadata Grid */}
            <div className="grid grid-cols-2 gap-4 text-gray-300">
              {/* Brand */}
              <div className="flex items-center gap-2 p-2 bg-gray-800 rounded-lg">
                <FaStore className="text-orange-500" />
                <span className="font-semibold">Brand:</span>
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm">
                  {product.brand}
                </span>
              </div>
              {/* Date Added */}
              <div className="flex items-center gap-2 p-2 bg-gray-800 rounded-lg">
                <FaClock className="text-indigo-500" />
                <span className="font-semibold">Added:</span>
                <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm">
                  {moment(product.createdAt).fromNow()}
                </span>
              </div>
              {/* Stock Status */}
              <div className="flex items-center gap-2 p-2 bg-gray-800 rounded-lg">
                <FaWarehouse className="text-green-500" />
                <span className="font-semibold">Stock:</span>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    product.countInStock > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.countInStock > 0
                    ? `${product.countInStock} available`
                    : "Out of stock"}
                </span>
              </div>
              {/* Category */}
              <div className="flex items-center gap-2 p-2 bg-gray-800 rounded-lg">
                <FaTags className="text-purple-500" />
                <span className="font-semibold">Category:</span>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
                  {product.category?.name || "Uncategorized"}
                </span>
              </div>
              {/* Date Added */}
              <div className="flex items-center gap-2 p-2 bg-gray-800 rounded-lg">
                <FaCalendarPlus className="text-indigo-500" />
                <span className="font-semibold">Added:</span>
                <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm">
                  {moment(product.createdAt).format("MMM D, YYYY")}
                </span>
              </div>
              {/* Total Quantity */}
              <div className="flex items-center gap-2 p-2 bg-gray-800 rounded-lg">
                <FaBoxes className="text-pink-500" />
                <span className="font-semibold">Quantity:</span>
                <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-sm">
                  {product.quantity}
                </span>
              </div>
              {/* Last Updated */}
              <div className="flex items-center gap-2 p-2 bg-gray-800 rounded-lg">
                <FaHistory className="text-pink-500" />
                <span className="font-semibold">Updated:</span>
                <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-sm">
                  {moment(product.updatedAt).fromNow()}
                </span>
              </div>
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div className="flex items-center gap-4">
              {product.countInStock > 0 ? (
                <div className="flex flex-col gap-2">
                  <div className="text-sm text-gray-300">
                    Quantity Available: {product.countInStock}
                  </div>
                  <div className="flex justify-center items-center gap-2 bg-gray-800 rounded-lg p-1">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-pink-600 text-white w-8 h-8 rounded-md flex items-center justify-center disabled:opacity-50"
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      disabled={qty === 1}
                      aria-label="Decrease quantity"
                    >
                      <FaMinus className="text-sm" />
                    </motion.button>

                    <span className="w-10 text-center text-white font-medium">
                      {qty}
                    </span>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-pink-600 text-white w-8 h-8 rounded-md flex items-center justify-center disabled:opacity-50"
                      onClick={() =>
                        setQty(Math.min(product.countInStock, qty + 1))
                      }
                      disabled={qty === product.countInStock}
                      aria-label="Increase quantity"
                    >
                      <FaPlus className="text-sm" />
                    </motion.button>
                  </div>
                </div>
              ) : (
                <span className="text-red-400 font-medium">Out of Stock</span>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addToCartHandler}
                disabled={product.countInStock === 0}
                className={`bg-pink-600 text-white px-6 py-3 rounded-lg transition-all flex-1 ${
                  product.countInStock === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-pink-700"
                }`}
              >
                {product.countInStock > 0 ? "Add to Cart" : "Unavailable"}
              </motion.button>
            </div>
          </div>
        </div>

        <div className="mt-32">
          {/* Reviews Section */}
          <ProductsTab
            loadingProductReview={loadingProductReview}
            userInfo={userInfo}
            submitHandler={submitHandler}
            rating={rating}
            setRating={setRating}
            comment={comment}
            setComment={setComment}
            product={product}
            formatRating={formatRating}
          />
        </div>
      </div>
    </motion.div>
  );
}
