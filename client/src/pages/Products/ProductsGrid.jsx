import HeartIcon from "../../components/HeartIcon";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ProductsGrid({ product }) {
  const { rating = 0, numReviews = 0 } = product;

  // Function to format the rating (round up to whole number if decimal)
  const formatRating = (rating) => {
    return rating % 1 === 0 ? rating.toFixed(0) : Math.ceil(rating).toFixed(0);
  };

  // Function to format the review text
  const formatReviewText = (numReviews) => {
    if (numReviews === 0) {
      return "No Review Yet";
    }
    if (numReviews === 1) {
      return "1 review";
    }
    return `${numReviews} reviews`;
  };

  return (
    <motion.div
      className="w-full sm:w-[25rem] gap-2 hover:shadow-lg transition-shadow duration-200"
      key={product._id} // Ensure unique key
      initial={{ opacity: 0, y: 20 }} // Start state
      animate={{ opacity: 1, y: 0 }} // End state
      transition={{ duration: 0.5 }} // Animation duration
    >
      {/* Product Image with Lazy Loading */}
      <div className="relative">
        <LazyLoadImage
          src={product.image}
          alt={product.name}
          className="w-[25rem] h-96 object-cover rounded-lg"
          effect="blur"
          threshold={100}
        />

        {/* Heart Icon (Favorite Button) */}
        <div className="absolute top-2 right-2">
          <HeartIcon product={product} />
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          {/* Product Name and Price */}
          <h2 className="flex justify-between items-center mb-2">
            <div className="text-lg text-pink-800 font-semibold truncate">
              {product.name}
            </div>
            <span className="bg-pink-100 text-pink-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(product?.price)}
            </span>
          </h2>
        </Link>
        {/* Rating Component */}
        {/* Rating and Reviews */}
        <div className="flex items-center mt-2 gap-2">
          {/* Stars */}
          <div className="flex">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                className={`text-${
                  index < Math.round(rating)
                    ? "yellow-400" // Yellow stars for filled rating
                    : "gray-300" // White stars for unfilled rating
                } text-sm`}
              />
            ))}
          </div>

          {/* Rating Number (always display, even if 0) */}
          <span className="text-gray-600">{formatRating(rating)}</span>

          {/* Review Text (always display, even if 0) */}
          <span className="text-gray-600">
            ({formatReviewText(numReviews)})
          </span>

          {/* View Details Button */}
          <Link
            to={`/product/${product._id}`}
            className="ml-auto bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors duration-200"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
