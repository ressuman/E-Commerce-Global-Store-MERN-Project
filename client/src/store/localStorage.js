// localStorage utilities for favorites
export const addFavoriteToLocalStorage = (product) => {
  if (!product?._id) {
    // Validate product has an ID
    console.error("Invalid product object:", product);
    return;
  }

  const favorites = getFavoritesFromLocalStorage();
  if (!favorites.some((p) => p._id === product._id)) {
    const updatedFavorites = [...favorites, product]; // Immutable update
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  }
};

export const removeFavoriteFromLocalStorage = (productId) => {
  const favorites = getFavoritesFromLocalStorage();
  const filteredFavorites = favorites.filter(
    (product) => product._id !== productId
  );
  localStorage.setItem("favorites", JSON.stringify(filteredFavorites));
};

export const getFavoritesFromLocalStorage = () => {
  try {
    const favoritesJSON = localStorage.getItem("favorites");
    return favoritesJSON ? JSON.parse(favoritesJSON) : [];
  } catch (error) {
    console.error("Error parsing favorites from localStorage:", error);
    return []; // Return empty array on error
  }
};

// Optional: Clear all favorites
export const clearFavoritesFromLocalStorage = () => {
  localStorage.removeItem("favorites");
};
