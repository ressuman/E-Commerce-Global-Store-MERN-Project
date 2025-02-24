import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import HeartIcon from "../../components/HeartIcon";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export default function ProductsCard({ p }) {
  const dispatch = useDispatch();

  const addToCartHandler = () => {
    dispatch(addToCart({ ...p, qty: 1 }));
    toast.success(`${p.name} added to cart`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="relative bg-gray-800 rounded-xl shadow-lg overflow-hidden  sm:w-[21.3rem]"
    >
      {/* Product Image Section */}
      <motion.section className="relative group">
        <Link to={`/product/${p._id}`} className="block">
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
            <span className="bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-medium text-center">
              {p.brand}
            </span>
            {p.category && (
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {p.category.name}
              </span>
            )}
          </div>

          <motion.img
            className="w-full h-64 object-cover"
            src={p.image}
            alt={p.name}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            onError={(e) => {
              e.target.src = "/images/placeholder-product.jpg";
            }}
          />
        </Link>

        <HeartIcon product={p} />
      </motion.section>

      {/* Product Details Section */}
      <div className="p-4 flex justify-between flex-col gap-4 h-48">
        <div className="flex justify-between items-start gap-8">
          <h3 className="text-lg font-semibold text-white truncate">
            {p.name}
          </h3>
          <p className="text-lg font-bold text-pink-500">
            ${p.price.toFixed(2)}
          </p>
        </div>

        <p className="text-gray-400 text-sm line-clamp-2">{p.description}</p>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors"
          >
            <Link
              to={`/product/${p._id}`}
              className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-medium flex items-center"
            >
              Details
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={addToCartHandler}
            className="p-2 rounded-full bg-gray-700 hover:bg-pink-600 transition-colors"
            aria-label={`Add ${p.name} to cart`}
          >
            <AiOutlineShoppingCart className="w-6 h-6 text-white" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
