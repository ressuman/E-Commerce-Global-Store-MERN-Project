import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Loader1 } from "../../components/Loader";
import {
  initializeShopData,
  resetFilters,
  selectFilterState,
  setError,
  setPriceRange,
  toggleBrand,
  toggleCategory,
} from "../../redux/features/shop/shopSlice";
import { useGetFilteredProductsQuery } from "../../redux/api/productsAndUploadApiSlice";
import { useGetCategoriesQuery } from "../../redux/api/categoriesApiSlice";
import ProductsCard from "../Products/ProductsCard";

export default function Shop() {
  const dispatch = useDispatch();
  const {
    categories,
    brands,
    checkedCategories,
    checkedBrands,
    priceRange,
    isLoading,
    error,
  } = useSelector(selectFilterState);

  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: products = [] } = useGetFilteredProductsQuery({
    checkedCategories,
    checkedBrands,
    priceRange,
  });

  // Initialize shop data
  useEffect(() => {
    if (categoriesData && products.length > 0) {
      dispatch(
        initializeShopData({
          categories: categoriesData,
          products: products, // Make sure products are properly set
        })
      );
    }
  }, [categoriesData, products, dispatch]);

  // Handle price range changes
  const handlePriceChange = (type, value) => {
    const newRange =
      type === "min"
        ? [Number(value), priceRange[1]]
        : [priceRange[0], Number(value)];
    dispatch(setPriceRange(newRange));
  };

  // Error handling
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(setError(null));
    }
  }, [error, dispatch]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-4"
    >
      <div className="ml-[15%] mr-[2%] mt-6">
        {" "}
        <div className="flex flex-col md:flex-row gap-2">
          {/* Filter Sidebar */}
          <motion.div
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className="bg-dark-800 p-6 rounded-xl w-full md:w-80"
          >
            <h2 className="text-3xl text-yellow-500 font-bold mb-6 text-center">
              Filters
            </h2>

            {/* Categories Filter */}
            <div className="mb-8">
              <h3 className="font-semibold text-green-500 mb-4 text-2xl">
                Categories
              </h3>
              {categories.map((category) => (
                <motion.div
                  key={category._id}
                  className="flex items-center mb-3"
                  whileHover={{ x: 5 }}
                >
                  <input
                    type="checkbox"
                    checked={checkedCategories.includes(category._id)}
                    onChange={() => dispatch(toggleCategory(category._id))}
                    className="form-checkbox text-pink-500"
                  />
                  <label className="ml-2 text-gray-300">{category.name}</label>
                </motion.div>
              ))}
            </div>

            {/* Brands Filter */}
            <div className="mb-8">
              <h3 className="font-semibold text-pink-500 mb-4 text-2xl">
                Brands
              </h3>
              {brands?.map((brand) => (
                <motion.div
                  key={brand}
                  className="flex items-center mb-3"
                  whileHover={{ x: 5 }}
                >
                  <input
                    type="checkbox"
                    checked={checkedBrands.includes(brand)}
                    onChange={() => dispatch(toggleBrand(brand))}
                    className="form-checkbox text-pink-500"
                  />
                  <label className="ml-2 text-gray-300">{brand}</label>
                </motion.div>
              ))}
            </div>

            {/* Price Range Filter */}
            <div className="mb-8">
              <h3 className="font-semibold mb-4">Price Range</h3>
              <div className="flex gap-4">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange("min", e.target.value)}
                  className="w-1/2 p-2 bg-dark-700 rounded"
                  placeholder="Min"
                />
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange("max", e.target.value)}
                  className="w-1/2 p-2 bg-dark-700 rounded"
                  placeholder="Max"
                />
              </div>
            </div>

            {/* Reset Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch(resetFilters())}
              className="w-full py-2 bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors"
            >
              Reset Filters
            </motion.button>
          </motion.div>

          {/* Products Grid */}
          <div className="flex-1">
            <motion.h2
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-5xl text-rose-300 font-bold mb-6 text-center"
            >
              {products.length} Products Found
            </motion.h2>

            {isLoading ? (
              <Loader1 />
            ) : (
              <motion.div
                layout
                className="flex justify-center flex-wrap gap-4"
              >
                <AnimatePresence>
                  {products.map((product) => (
                    <motion.div
                      key={product._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <ProductsCard p={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
