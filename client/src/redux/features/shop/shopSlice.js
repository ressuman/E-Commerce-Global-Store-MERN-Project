import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  products: [],
  checkedCategories: [],
  checkedBrands: [],
  priceRange: [0, 1000000], // Default wide range
  error: null,
  isLoading: false,
};

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    // Loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    // Initialize shop data
    initializeShopData: (state, action) => {
      const { categories, products } = action.payload;
      state.categories = categories;
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
      const [min, max] = action.payload;
      if (!isNaN(min) && !isNaN(max)) {
        state.priceRange = [Number(min), Number(max)];
      }
    },

    // Brand selection
    toggleBrand: (state, action) => {
      const brand = action.payload;
      state.checkedBrands = state.checkedBrands.includes(brand)
        ? state.checkedBrands.filter((b) => b !== brand)
        : [...state.checkedBrands, brand];
    },

    // Reset all filters
    resetFilters: (state) => {
      state.checkedCategories = [];
      state.checkedBrands = [];
      state.priceRange = [0, 1000000];
      state.error = null;
    },

    // Error handling
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

// Selectors
export const selectFilterState = (state) => ({
  categories: state.shop.categories,
  //brands: [...new Set(state.shop.products.map((p) => p.brand))],
  // brands: [
  //   ...new Set(state.shop.products.flatMap((p) => (p.brand ? [p.brand] : []))),
  // ],
  brands: [
    ...new Set(
      state.shop.products
        .map((p) => p.brand)
        .filter((brand) => brand && brand.trim() !== "")
    ),
  ].sort(),
  checkedCategories: state.shop.checkedCategories,
  checkedBrands: state.shop.checkedBrands,
  priceRange: state.shop.priceRange,
  isLoading: state.shop.isLoading,
  error: state.shop.error,
});

export const selectFilteredProducts = (state) => {
  const { products, checkedCategories, checkedBrands, priceRange } = state.shop;
  return products.filter((product) => {
    const categoryMatch =
      checkedCategories.length === 0 ||
      checkedCategories.includes(product.category?._id);
    const brandMatch =
      checkedBrands.length === 0 || checkedBrands.includes(product.brand);
    const priceMatch =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    return categoryMatch && brandMatch && priceMatch;
  });
};

export const {
  setLoading,
  initializeShopData,
  toggleCategory,
  toggleBrand,
  setPriceRange,
  resetFilters,
  setError,
} = shopSlice.actions;

export default shopSlice.reducer;
