import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useCreateOrderMutation } from "../../redux/api/ordersAndPaymentApiSlice";
import { useEffect } from "react";
import { Slide, toast } from "react-toastify";
import { clearCartItems } from "../../redux/features/cart/cartSlice";
import { Loader1 } from "../../components/Loader";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";

export default function PlaceOrder() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
    exit: { opacity: 0 },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0 },
  };

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      toast.error("Please complete shipping information first", {
        transition: Slide,
      });
      navigate("/shipping");
    }
  }, [cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems.map((item) => ({
          product: item._id,
          qty: item.qty,
          //price: item.price,
          price: Number(item.price.toFixed(2)),
          image: item.image,
          name: item.name,
        })),
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
        payment_status: "pending",
        taxRate: cart.taxRate,
        country: cart.shippingAddress.country,
      }).unwrap();

      dispatch(clearCartItems());

      toast.success(
        <div>
          {" "}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2"
          >
            Order placed successfully!
          </motion.div>
        </div>,
        { transition: Slide }
      );

      navigate(`/order/${res._id}`);
    } catch (error) {
      console.error("Order error:", error);
      toast.error(
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500"
          >
            {error?.data?.error || "Failed to place order"}
          </motion.div>
        </div>,
        { transition: Slide }
      );
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
        className="container mx-auto mt-8 px-4"
      >
        <div className="ml-[15%] mr-[2%]">
          {" "}
          <ProgressSteps step1 step2 step3 />
          {cart.cartItems.length === 0 ? (
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
            >
              <Message>Your cart is empty</Message>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              className="overflow-x-auto"
            >
              <motion.table
                variants={itemVariants}
                className="w-full border-collapse"
              >
                <thead>
                  <tr>
                    {["Image", "Product", "Quantity", "Price", "Total"].map(
                      (header, idx) => (
                        <th
                          key={idx}
                          className="px-1 py-2 text-center bg-pink-800 text-lg uppercase"
                        >
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody>
                  <AnimatePresence>
                    {cart.cartItems.map((item, index) => (
                      <motion.tr
                        key={index}
                        variants={itemVariants}
                        className="hover:bg-gray-800 transition-colors text-center"
                      >
                        <td className="p-2">
                          <motion.img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                            whileHover={{ scale: 1.05 }}
                          />
                        </td>
                        <td className="p-2">
                          <Link
                            to={`/product/${item._id}`}
                            className="hover:text-pink-500 transition-colors"
                          >
                            {item.name}
                          </Link>
                        </td>
                        <td className="p-2">{item.qty}</td>
                        <td className="p-2">${item.price.toFixed(2)}</td>
                        <td className="p-2">
                          ${(item.qty * item.price).toFixed(2)}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </motion.table>
            </motion.div>
          )}
          <motion.div variants={containerVariants} className="mt-8 space-y-8">
            <motion.div
              variants={itemVariants}
              className="bg-[#181818] p-8 rounded-lg shadow-xl"
            >
              <h2 className="text-2xl font-semibold mb-5 text-pink-500">
                Order Summary
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <motion.div variants={itemVariants}>
                  <h3 className="text-xl text-green-600 font-semibold mb-4">
                    Cost Breakdown
                  </h3>
                  <ul className="space-y-3">
                    {[
                      ["Items:", cart.itemsPrice],
                      ["Shipping:", cart.shippingPrice],
                      [
                        `Tax (${(cart.taxRate * 100).toFixed(1)}%):`,
                        cart.taxPrice,
                      ],
                      ["Subtotal:", cart.subTotal],
                      ["Total:", cart.totalPrice],
                    ].map(([label, value], index) => (
                      <motion.li
                        key={index}
                        className="flex justify-between py-2 border-b border-gray-700"
                        variants={itemVariants}
                      >
                        <span>{label}</span>
                        <span>${value}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-6">
                  <div>
                    <h3 className="text-xl text-green-600 font-semibold mb-3">
                      Shipping Details
                    </h3>
                    <p className="text-gray-300">
                      {cart.shippingAddress.address},{" "}
                      {cart.shippingAddress.city}
                      <br />
                      {cart.shippingAddress.postalCode},{" "}
                      {cart.shippingAddress.country}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl text-green-600  font-semibold mb-3">
                      Payment Method
                    </h3>
                    <p className="text-gray-300 capitalize">
                      {cart.paymentMethod}
                    </p>
                  </div>
                </motion.div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6"
                >
                  <Message variant="error">{error.data.message}</Message>
                </motion.div>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`bg-pink-600 text-white py-3 px-8 rounded-full text-lg w-full md:w-auto ${
                  cart.cartItems.length === 0
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={cart.cartItems.length === 0 || isLoading}
                onClick={placeOrderHandler}
              >
                {isLoading ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    Processing...
                  </motion.span>
                ) : (
                  "Place Order"
                )}
              </motion.button>
            </motion.div>
          </motion.div>
          {isLoading && <Loader1 />}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
