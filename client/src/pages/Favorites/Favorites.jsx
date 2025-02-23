import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import {
  clearFavorites,
  removeFromFavorites,
  selectFavoriteProduct,
  setFavorites,
} from "../../redux/features/favorites/favoritesSlice";
import ProductsGrid from "../Products/ProductsGrid";
import { Loader1 } from "../../components/Loader";
import Message from "../../components/Message";
import { useEffect, useState } from "react";
import {
  clearFavoritesFromLocalStorage,
  getFavoritesFromLocalStorage,
  removeFavoriteFromLocalStorage,
} from "../../store/localStorage";
import { toast } from "react-toastify";

export default function Favorites() {
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavoriteProduct);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const localStorageFavorites = getFavoritesFromLocalStorage();
      dispatch(setFavorites(localStorageFavorites));
    } catch (err) {
      setError("Failed to load favorites from storage");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const handleClearFavorites = () => {
    if (favorites.length === 0) {
      return;
    }

    if (window.confirm("Are you sure you want to clear all favorites?")) {
      try {
        dispatch(clearFavorites());
        clearFavoritesFromLocalStorage();
        toast.success("All favorites cleared successfully!");
      } catch (error) {
        toast.error("Failed to clear favorites: " + error.message);
      }
    }
  };

  if (loading) {
    return <Loader1 />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <Message variant="error">
          Error loading favorites: {error.message || "Unknown error occurred"}.
          Please try refreshing the page
        </Message>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-bold mb-8 text-center text-pink-800"
      >
        Your Favorite Products
      </motion.h1>

      {/* Add Clear Button Here */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center mb-8"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClearFavorites}
          className={`bg-pink-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all ${
            favorites.length === 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-pink-600 hover:shadow-lg"
          }`}
          disabled={favorites.length === 0}
        >
          <FaTrash className="inline-block" />
          Clear All Favorites
        </motion.button>
      </motion.div>

      {favorites.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 mt-12"
        >
          <div className="container mx-auto px-4 py-8 min-h-screen text-2xl flex items-center justify-center">
            {" "}
            <Message variant="info">
              No favorites yet! ❤️ Start adding products to your favorites
              collection.
            </Message>
          </div>
        </motion.div>
      ) : (
        <AnimatePresence>
          <div className="flex justify-center flex-wrap mt-[2rem] gap-8 ml-[11%] mr-[2%]">
            {favorites.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <ProductsGrid
                  product={product}
                  onRemove={() => {
                    dispatch(removeFromFavorites(product));
                    removeFavoriteFromLocalStorage(product._id);
                  }}
                />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
