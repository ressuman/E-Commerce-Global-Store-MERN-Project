import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addToCart, removeFromCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMinus,
  FaPlus,
  FaTrash,
  FaStore,
  FaTag,
  FaBox,
  FaDollarSign,
  FaArrowLeft,
  FaWallet,
  FaShoppingCart,
  FaPercentage,
  FaTruck,
} from "react-icons/fa";
import { useGetProductByIdQuery } from "../../redux/api/productsAndUploadApiSlice";

// New CartItem component
const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const { data: currentProduct, isLoading } = useGetProductByIdQuery(item._id);

  const availableStock = currentProduct?.countInStock ?? item.countInStock;
  const remainingStock = availableStock - item.qty;

  const handleUpdateQuantity = (newQty) => {
    if (newQty > availableStock) {
      toast.error(`Only ${availableStock} units available`);
      return;
    }
    dispatch(addToCart({ ...item, qty: newQty }));
    toast.success(`${item.name} quantity updated to ${newQty}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-4 mb-6 p-4 bg-gray-800 rounded-lg"
    >
      <motion.div whileHover={{ scale: 1.05 }} className="w-20 h-20 shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover rounded"
        />
      </motion.div>

      <div className="flex-1 space-y-2">
        <Link
          to={`/product/${item._id}`}
          className="text-xl font-medium text-pink-400 hover:text-pink-300"
        >
          {item.name}
        </Link>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <FaStore className="text-orange-400" />
            <span className="text-gray-300">Brand:</span>
            <span className="font-medium">{item.brand}</span>
          </div>

          <div className="flex items-center gap-2">
            <FaTag className="text-purple-400" />
            <span className="text-gray-300">Category:</span>
            <span className="font-medium">
              {item.category?.name || "Uncategorized"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <FaDollarSign className="text-green-400" />
            <span className="text-gray-300">Price:</span>
            <span className="font-medium text-red-600 text-xl">
              ${item.price.toFixed(2).toLocaleString("en-US")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <FaBox className="text-blue-400" />
            <span className="text-gray-300">Stock:</span>
            <span
              className={`font-medium ${
                remainingStock <= 3 ? "text-red-400" : "text-green-400"
              }`}
            >
              {isLoading ? (
                <span className="animate-pulse">...</span>
              ) : (
                `${remainingStock} remaining`
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-gray-700 rounded-lg p-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-pink-600 text-white w-8 h-8 rounded-md flex items-center justify-center disabled:opacity-50"
            onClick={() => handleUpdateQuantity(Math.max(1, item.qty - 1))}
            disabled={item.qty === 1}
            aria-label="Decrease quantity"
          >
            <FaMinus className="text-sm" />
          </motion.button>

          <span className="w-10 text-center text-white font-medium">
            {item.qty}
          </span>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-pink-600 text-white w-8 h-8 rounded-md flex items-center justify-center disabled:opacity-50"
            onClick={() => handleUpdateQuantity(item.qty + 1)}
            disabled={item.qty >= availableStock}
            aria-label="Increase quantity"
          >
            <FaPlus className="text-sm" />
          </motion.button>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-red-400 hover:text-red-300 ml-4"
          onClick={() => dispatch(removeFromCart(item._id))}
          aria-label={`Remove ${item.name} from cart`}
        >
          <FaTrash size={20} />
        </motion.button>
      </div>
    </motion.div>
  );
};

// Main Cart component
export default function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const checkoutHandler = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    navigate("/login?redirect=/shipping");
  };

  return (
    <div className="container mx-auto mt-8 px-4">
      <div className="ml-[15%] mr-[2%] mt-6">
        {/* Go Back Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors"
          >
            <FaArrowLeft className="inline-block" />
            <span className="font-medium">Back to Previous Page</span>
          </button>
        </motion.div>

        <AnimatePresence>
          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center min-h-screen flex flex-col items-center justify-center"
            >
              <h2 className="text-3xl font-semibold mb-4">
                Your cart is empty
              </h2>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/shop"
                  className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
                >
                  Continue Shopping
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col lg:flex-row gap-8 justify-between"
            >
              <div className="flex-1">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-3xl font-bold mb-6"
                >
                  Shopping Cart
                </motion.h1>

                <AnimatePresence>
                  {cartItems.map((item) => (
                    <CartItem key={item._id} item={item} />
                  ))}
                </AnimatePresence>
              </div>

              {/* Order Summary (keep existing code) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:w-96 bg-gray-800 p-6 rounded-xl h-fit sticky top-8"
              >
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <FaWallet className="text-amber-400" />
                  Order Summary
                </h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <FaShoppingCart className="text-lime-400" />
                      Items (
                      {cartItems.reduce((acc, item) => acc + item.qty, 0)})
                    </span>
                    <span>${cart.itemsPrice}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <FaTruck className="text-emerald-400" />
                      Shipping
                    </span>
                    <span>${cart.shippingPrice}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <FaPercentage className="text-rose-400" />
                      Tax
                    </span>
                    <span>${cart.taxPrice}</span>
                  </div>
                  <div className="flex justify-between items-center text-xl font-bold pt-4 border-t border-gray-700">
                    <span className="flex items-center gap-2">
                      <FaWallet className="text-cyan-400" />
                      Total
                    </span>
                    <span>${cart.totalPrice}</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    cartItems.length === 0
                      ? "bg-sky-600 cursor-not-allowed"
                      : "bg-violet-500 hover:bg-violet-600"
                  }`}
                  onClick={checkoutHandler}
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
