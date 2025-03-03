import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProgressSteps from "../../components/ProgressSteps";
import { motion, AnimatePresence, stagger } from "framer-motion";
import { useEffect, useState } from "react";
import {
  savePaymentMethod,
  saveShippingAddress,
} from "../../redux/features/cart/cartSlice";
import { Slide, toast } from "react-toastify";
//import { CheckCircleIcon } from "lucide-react";

export default function Shipping() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress, paymentMethod: storedPaymentMethod } = cart;

  const [paymentMethod, setPaymentMethod] = useState(storedPaymentMethod);
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");
  const [errors, setErrors] = useState({});

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
        when: "beforeChildren",
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120 },
    },
    exit: { opacity: 0, y: -20 },
  };

  const errorVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 },
  };

  const validateForm = () => {
    const newErrors = {};
    if (!address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!city.trim()) {
      newErrors.city = "City is required";
    }
    if (!postalCode.trim()) {
      newErrors.postalCode = "Postal code is required";
    }
    if (!country.trim()) {
      newErrors.country = "Country is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const submitHandler = (e) => {
  //   e.preventDefault();

  //   if (!address || !city || !postalCode || !country) {
  //     toast.error("Please fill in all shipping fields");
  //     return;
  //   }

  //   if (!validateForm()) {
  //     return;
  //   }

  //   dispatch(saveShippingAddress({ address, city, postalCode, country }));
  //   dispatch(savePaymentMethod(paymentMethod));
  //   navigate("/placeOrder");
  // };
  const submitHandler = (e) => {
    e.preventDefault();

    // Validate form and get validation status
    const isValid = validateForm();

    if (!isValid) {
      // Animated error notification with combined messages
      toast.error(
        <div className="space-y-1">
          {Object.values(errors).map((error, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm"
            >
              • {error}
            </motion.div>
          ))}
        </div>,
        {
          position: "top-center",
          autoClose: 5000,
          closeOnClick: true,
          transition: Slide,
        }
      );
      return;
    }

    // Save shipping details
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    dispatch(savePaymentMethod(paymentMethod));

    // Success notification with animated checkmark
    toast.success(
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="flex items-center gap-2"
      >
        Shipping details saved successfully!
      </motion.div>,
      {
        position: "top-center",
        onClose: () => {
          navigate("/placeOrder");
        },
      }
    );
  };

  useEffect(() => {
    if (cart.cartItems.length === 0) {
      toast.error("Your cart is empty");
      navigate("/cart");
    }
  }, [navigate, cart.cartItems]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="shipping-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="ml-[15%] mr-[2%]">
          <ProgressSteps step1 step2 />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mt-2 flex justify-around items-center flex-wrap"
          >
            <motion.form
              variants={containerVariants}
              onSubmit={submitHandler}
              className="w-[40rem] p-8 rounded-lg shadow-lg"
            >
              <motion.h1
                variants={childVariants}
                className="text-2xl font-semibold mb-6 text-pink-600"
              >
                Shipping Details
              </motion.h1>

              <div className="space-y-4">
                <motion.div variants={childVariants}>
                  <label htmlFor="address" className="block text-white mb-2">
                    Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
                    placeholder="Enter street address"
                    value={address}
                    required
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <AnimatePresence>
                    {errors.address && (
                      <motion.div
                        variants={errorVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.address}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div
                  variants={childVariants}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div>
                    <label htmlFor="city" className="block text-white mb-2">
                      City
                    </label>
                    <input
                      id="city"
                      type="text"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
                      placeholder="Enter city"
                      value={city}
                      required
                      onChange={(e) => setCity(e.target.value)}
                    />
                    <AnimatePresence>
                      {errors.city && (
                        <motion.div
                          variants={errorVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="text-red-500 text-sm mt-1"
                        >
                          {errors.city}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div>
                    <label
                      htmlFor="postalCode"
                      className="block text-white mb-2"
                    >
                      Postal Code
                    </label>
                    <input
                      id="postalCode"
                      type="text"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
                      placeholder="Enter postal code"
                      value={postalCode}
                      required
                      onChange={(e) => setPostalCode(e.target.value)}
                    />
                    <AnimatePresence>
                      {errors.postalCode && (
                        <motion.div
                          variants={errorVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="text-red-500 text-sm mt-1"
                        >
                          {errors.postalCode}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                <motion.div variants={childVariants}>
                  <label htmlFor="country" className="block text-white mb-2">
                    Country
                  </label>
                  <input
                    id="country"
                    type="text"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
                    placeholder="Enter country"
                    value={country}
                    required
                    onChange={(e) => setCountry(e.target.value)}
                  />
                  <AnimatePresence>
                    {errors.country && (
                      <motion.div
                        variants={errorVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.country}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div
                  variants={childVariants}
                  className="mt-6 p-4 bg-gray-50 rounded-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <h2 className="text-lg font-medium text-gray-700 mb-3">
                    Payment Method
                  </h2>
                  <motion.div
                    className="flex items-center space-x-3"
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      type="radio"
                      id="stripe"
                      className="h-5 w-5 text-pink-600 border-gray-300 focus:ring-pink-500"
                      name="paymentMethod"
                      value="Stripe"
                      checked={paymentMethod === "Stripe"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label htmlFor="stripe" className="flex items-center">
                      <span className="ml-2 text-gray-700">
                        Credit/Debit Card (Stripe)
                      </span>
                      <motion.img
                        src="/images/stripe.svg"
                        alt="Stripe"
                        className="h-10 ml-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      />
                    </label>
                  </motion.div>
                </motion.div>
              </div>

              <motion.button
                variants={childVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-8 bg-pink-600 hover:bg-pink-700 text-white py-3 px-6 rounded-lg transition-colors duration-200"
                type="submit"
              >
                Continue to Payment
              </motion.button>
            </motion.form>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
