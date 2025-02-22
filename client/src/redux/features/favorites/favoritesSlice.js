import { createSlice } from "@reduxjs/toolkit";

const favoriteSlice = createSlice({
  name: "favorites",
  initialState: [],
  reducers: {
    addToFavorites: (state, action) => {
      const existingProduct = state.find(
        (product) => product._id === action.payload._id
      );
      if (!existingProduct) {
        state.push(action.payload);
      }
    },
    removeFromFavorites: (state, action) => {
      return state.filter((product) => product._id !== action.payload._id);
    },
    setFavorites: (state, action) => {
      return Array.isArray(action.payload) ? action.payload : [];
    },
    clearFavorites: (state) => {
      return [];
    },
  },
});

export const {
  addToFavorites,
  removeFromFavorites,
  setFavorites,
  clearFavorites,
} = favoriteSlice.actions;

export const selectFavoriteProduct = (state) => state.favorites;

export default favoriteSlice.reducer;
