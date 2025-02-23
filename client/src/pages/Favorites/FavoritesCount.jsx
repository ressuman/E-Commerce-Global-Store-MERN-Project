import { useMemo } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

export default function FavoritesCount() {
  const favorites = useSelector((state) => state.favorites || []);
  const favoriteCount = useMemo(() => favorites.length, [favorites]);

  return (
    <div className="absolute left-2 top-8 z-10">
      <motion.div
        key={favoriteCount}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {favoriteCount > 0 && (
          <span
            className="flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-pink-500 rounded-full"
            aria-label={`${favoriteCount} items in favorites`}
          >
            {favoriteCount}
          </span>
        )}
      </motion.div>
    </div>
  );
}
