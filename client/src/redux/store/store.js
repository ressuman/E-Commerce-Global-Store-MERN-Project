import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "../api/apiSlice";
import authReducer from "../features/auth/authSlice";
import { getFavoritesFromLocalStorage } from "../../store/localStorage";
import favoritesReducer from "../features/favorites/favoritesSlice";
import cartReducer from "../features/cart/cartSlice";
import shopReducer from "../features/shop/shopSlice";
// import cartSliceReducer from "../redux/features/cart/cartSlice";
// import shopReducer from "../redux/features/shop/shopSlice";

const initialFavorites = (() => {
  try {
    return getFavoritesFromLocalStorage() || [];
  } catch (error) {
    console.error("Error loading favorites from localStorage:", error);
    return [];
  }
})();

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    favorites: favoritesReducer,
    cart: cartReducer,
    shop: shopReducer,
  },

  preloadedState: {
    favorites: initialFavorites,
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(apiSlice.middleware),
  // devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable if you encounter issues with non-serializable data
    }).concat(apiSlice.middleware),

  devTools: import.meta.env.NODE_ENV === "development", // Enabled only in development
});

setupListeners(store.dispatch);

export default store;
