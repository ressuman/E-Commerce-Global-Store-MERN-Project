import { toast } from "react-toastify";
import { PRODUCT_URL, UPLOAD_URL } from "../../utils/constants";
import { apiSlice } from "./apiSlice";
import { setError, setLoading } from "../features/shop/shopSlice";

export const productsAndUploadApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch products with optional keyword filtering
    fetchPaginatedProducts: builder.query({
      query: ({ keyword }) => ({
        url: `${PRODUCT_URL}/fetch-products/search`,
        params: { keyword },
      }),
      keepUnusedDataFor: 60,
      providesTags: ["Product"],
      onQueryStarted: async ({ keyword }, { queryFulfilled }) => {
        try {
          const result = await queryFulfilled;
          console.log(
            `Fetched paginated products with keyword: "${keyword}"`,
            result
          );
        } catch (error) {
          console.error("Error fetching paginated products:", error);
        }
      },
    }),

    // Fetch all products (no filters)
    getAllProducts: builder.query({
      query: () => `${PRODUCT_URL}/get-all-products`,
      providesTags: ["Product"],
      keepUnusedDataFor: 60,
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          const result = await queryFulfilled;
          console.log("Fetched all products:", result);
        } catch (error) {
          console.error("Error fetching all products:", error);
        }
      },
    }),

    // Fetch product details by ID
    getProductById: builder.query({
      query: (productId) => ({
        url: `${PRODUCT_URL}/get-product/${productId}`,
      }),
      keepUnusedDataFor: 60,
      providesTags: (result, error, productId) => [
        { type: "Product", id: productId },
      ],
      onQueryStarted: async (productId, { queryFulfilled }) => {
        try {
          const result = await queryFulfilled;
          console.log(`Fetched product details for ID: ${productId}`, result);
        } catch (error) {
          console.error(
            `Error fetching product details for ID: ${productId}`,
            error
          );
        }
      },
    }),

    // Create a new product
    addProduct: builder.mutation({
      query: (productData) => ({
        url: `${PRODUCT_URL}/add-product`,
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Product"],
      onQueryStarted: async (productData, { queryFulfilled }) => {
        try {
          const result = await queryFulfilled;
          console.log("Product added successfully:", result);
        } catch (error) {
          console.error("Error adding product:", error);
        }
      },
    }),

    // Update an existing product
    updateProductById: builder.mutation({
      query: ({ productId, updatedData }) => ({
        url: `${PRODUCT_URL}/update-product/${productId}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Product", id: productId },
      ],
      onQueryStarted: async (
        { productId, updatedData },
        { queryFulfilled }
      ) => {
        try {
          const result = await queryFulfilled;
          console.log(
            `Product updated successfully for ID: ${productId}`,
            result
          );
        } catch (error) {
          console.error(`Error updating product for ID: ${productId}`, error);
        }
      },
    }),

    // Upload a product image
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}/images/upload`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product", "Upload"],
      onQueryStarted: async (data, { queryFulfilled }) => {
        console.log("Uploading image...");
        try {
          const result = await queryFulfilled;
          console.log("Image uploaded successfully:", result);
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      },
    }),

    // Delete a product by ID
    deleteProductById: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCT_URL}/delete-product/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, productId) => [
        { type: "Product", id: productId },
      ],
      onQueryStarted: async (productId, { queryFulfilled }) => {
        try {
          const result = await queryFulfilled;
          console.log(
            `Product deleted successfully for ID: ${productId}`,
            result
          );
        } catch (error) {
          console.error(`Error deleting product for ID: ${productId}`, error);
        }
      },
    }),

    // Create a product review
    addProductReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_URL}/add-review/${data.productId}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, data) => [
        { type: "Product", id: data.productId },
      ],
      onQueryStarted: async (data, { queryFulfilled }) => {
        try {
          const result = await queryFulfilled;
          console.log(`Review added for product ID: ${data.productId}`, result);
        } catch (error) {
          console.error(
            `Error adding review for product ID: ${data.productId}`,
            error
          );
        }
      },
    }),

    // Fetch top-rated products
    getTopProducts: builder.query({
      query: () => `${PRODUCT_URL}/get-top-products`,
      keepUnusedDataFor: 60,
      providesTags: ["Product"],
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          const result = await queryFulfilled;
          console.log("Fetched top-rated products:", result);
        } catch (error) {
          console.error("Error fetching top-rated products:", error);
        }
      },
    }),

    // Fetch newly added products
    fetchNewProducts: builder.query({
      query: () => `${PRODUCT_URL}/fetch-new-products`,
      keepUnusedDataFor: 60,
      providesTags: ["Product"],
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          const result = await queryFulfilled;
          console.log("Fetched newly added products:", result);
        } catch (error) {
          console.error("Error fetching newly added products:", error);
        }
      },
    }),

    // Fetch filtered products
    // getFilteredProducts: builder.query({
    //   query: ({ checked, radio }) => ({
    //     url: `${PRODUCT_URL}/get-filtered-products`,
    //     method: "POST",
    //     body: { checked, radio },
    //   }),
    //   providesTags: ["Product"],
    //   keepUnusedDataFor: 60,
    //   onQueryStarted: async ({ checked, radio }, { queryFulfilled }) => {
    //     try {
    //       const result = await queryFulfilled;
    //       console.log("Fetched filtered products:", result);
    //     } catch (error) {
    //       console.error("Error fetching filtered products:", error);
    //     }
    //   },
    // }),
    getFilteredProducts: builder.query({
      query: (filters) => ({
        url: `${PRODUCT_URL}/get-filtered-products`,
        method: "POST",
        body: {
          categories: filters.checkedCategories,
          brands: filters.checkedBrands,
          priceRange: filters.priceRange,
        },
      }),
      keepUnusedDataFor: 60,
      providesTags: ["Product"],
      onQueryStarted: async (filters, { dispatch, queryFulfilled }) => {
        try {
          dispatch(setLoading(true));
          await queryFulfilled;
        } catch (error) {
          dispatch(setError(error.message));
          toast.error("Failed to load products");
        } finally {
          dispatch(setLoading(false));
        }
      },
    }),
  }),
});

export const {
  useFetchPaginatedProductsQuery,
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductByIdMutation,
  useUploadProductImageMutation,
  useDeleteProductByIdMutation,
  useAddProductReviewMutation,
  useGetTopProductsQuery,
  useFetchNewProductsQuery,
  useGetFilteredProductsQuery,
} = productsAndUploadApiSlice;
