import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromFavorites,
  selectFavoriteProduct,
  setFavorites,
} from "../../redux/features/favorites/favoritesSlice";
import ProductsGrid from "../Products/ProductsGrid";
import { Loader1 } from "../../components/Loader";
import Message from "../../components/Message";
import { useEffect, useState } from "react";
import {
  getFavoritesFromLocalStorage,
  removeFavoriteFromLocalStorage,
} from "../../store/localStorage";

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
        <div className="flex justify-center flex-wrap mt-[2rem] gap-8 ml-[11%] mr-[2%]">
          {favorites.map((product) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
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
      )}
    </div>
  );
}
