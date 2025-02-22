import { useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  addFavoriteToLocalStorage,
  getFavoritesFromLocalStorage,
  removeFavoriteFromLocalStorage,
} from "../store/localStorage";
import {
  addToFavorites,
  removeFromFavorites,
  setFavorites,
} from "../redux/features/favorites/favoritesSlice";
import { toast } from "react-toastify";

export default function HeartIcon({ product }) {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites) || [];

  const isFavorite = favorites.some((p) => p._id === product._id);

  useEffect(() => {
    const favoritesFromLocalStorage = getFavoritesFromLocalStorage();
    dispatch(setFavorites(favoritesFromLocalStorage));
  }, [dispatch]);

  const toggleFavorites = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(product));
      removeFavoriteFromLocalStorage(product._id);
      toast.info(
        `Removed "${product.name}" from favorites`
        // {
        //   position: "bottom-right",
        //   autoClose: 2000,
        //   hideProgressBar: true,
        // }
      );
    } else {
      dispatch(addToFavorites(product));
      addFavoriteToLocalStorage(product);
      toast.success(
        `Added "${product.name}" to favorites!`
        // {
        //   position: "bottom-right",
        //   autoClose: 2000,
        //   hideProgressBar: true,
        // }
      );
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      className="absolute top-2 right-5 cursor-pointer"
      onClick={toggleFavorites}
    >
      {isFavorite ? (
        <FaHeart className="text-pink-500" />
      ) : (
        <FaRegHeart className="text-pink-900" />
      )}
    </motion.button>
  );
}
