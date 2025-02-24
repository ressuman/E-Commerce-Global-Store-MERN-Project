import { useMemo } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

export default function CartCount() {
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const cartQuantity = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.qty, 0),
    [cartItems]
  );

  return (
    <div className="absolute left-2 top-8 z-10">
      <motion.div
        key={cartQuantity}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {cartQuantity > 0 && (
          <span
            className="flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-pink-500 rounded-full"
            aria-label={`${cartQuantity} items in cart`}
          >
            {cartQuantity}
          </span>
        )}
      </motion.div>
    </div>
  );
}
