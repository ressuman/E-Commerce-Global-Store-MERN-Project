import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  products: [],
  checkedCategories: [],
  priceRange: [],
  brands: [],
  checkedBrands: [],
  error: null,
};

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    // Initialize shop data
    initializeShopData: (state, action) => {
      const { categories, brands, products } = action.payload;
      if (!Array.isArray(categories)) {
        state.error = "Invalid categories data";
        return;
      }
      state.categories = categories;
      state.brands = brands;
      state.products = products;
      state.error = null;
    },

    // Category selection
    toggleCategory: (state, action) => {
      const categoryId = action.payload;
      state.checkedCategories = state.checkedCategories.includes(categoryId)
        ? state.checkedCategories.filter((id) => id !== categoryId)
        : [...state.checkedCategories, categoryId];
    },

    // Price range selection
    setPriceRange: (state, action) => {
      if (!Array.isArray(action.payload)) {
        state.error = "Price range must be an array";
        return;
      }
      state.priceRange = action.payload;
    },

    // Brand selection
    toggleBrand: (state, action) => {
      const brandId = action.payload;
      state.checkedBrands = state.checkedBrands.includes(brandId)
        ? state.checkedBrands.filter((id) => id !== brandId)
        : [...state.checkedBrands, brandId];
    },

    // Reset all filters
    resetFilters: (state) => {
      state.checkedCategories = [];
      state.priceRange = [];
      state.checkedBrands = [];
      state.error = null;
    },

    // Error handling
    setShopError: (state, action) => {
      state.error = action.payload;
    },
  },
});

// Selectors
export const selectFilteredProducts = (state) => {
  const { products, checkedCategories, checkedBrands, priceRange } = state.shop;

  return products.filter((product) => {
    const matchesCategory =
      checkedCategories.length === 0 ||
      checkedCategories.includes(product.category);
    const matchesBrand =
      checkedBrands.length === 0 || checkedBrands.includes(product.brand);
    const matchesPrice =
      priceRange.length === 0 ||
      (product.price >= priceRange[0] && product.price <= priceRange[1]);

    return matchesCategory && matchesBrand && matchesPrice;
  });
};

export const {
  initializeShopData,
  toggleCategory,
  setPriceRange,
  toggleBrand,
  resetFilters,
  setShopError,
} = shopSlice.actions;

export default shopSlice.reducer;
