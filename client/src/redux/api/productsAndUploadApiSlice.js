import { PRODUCT_URL, UPLOAD_URL } from "../../utils/constants";
import { apiSlice } from "./apiSlice";

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
    }),

    // Fetch product details by ID
    // getProductById: builder.query({
    //   query: (productId) => `${PRODUCT_URL}/${productId}`,
    //   providesTags: (result, error, productId) => [
    //     { type: "Product", id: productId },
    //   ],
    // }),

    // Fetch all products (no filters)
    getAllProducts: builder.query({
      query: () => `${PRODUCT_URL}/get-all-products`,
      providesTags: ["Product"],
      keepUnusedDataFor: 60,
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
    }),

    // Create a new product
    addProduct: builder.mutation({
      query: (productData) => ({
        url: `${PRODUCT_URL}/add-product`,
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Product"],
    }),

    // Update an existing product
    updateProductById: builder.mutation({
      query: ({ productId, formData }) => ({
        url: `${PRODUCT_URL}/update-product/${productId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Product", id: productId },
      ],
    }),

    // Upload a product image
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}/images/upload`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product", "Upload"],
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
    }),

    // Fetch top-rated products
    getTopProducts: builder.query({
      query: () => `${PRODUCT_URL}/get-top-products`,
      keepUnusedDataFor: 60,
      providesTags: ["Product"],
    }),

    // Fetch newly added products
    fetchNewProducts: builder.query({
      query: () => `${PRODUCT_URL}/fetch-new-products`,
      keepUnusedDataFor: 60,
      providesTags: ["Product"],
    }),

    // Fetch filtered products
    getFilteredProducts: builder.query({
      query: ({ checked, radio }) => ({
        url: `${PRODUCT_URL}/get-filtered-products`,
        method: "POST",
        body: { checked, radio },
      }),
      providesTags: ["Product"],
      keepUnusedDataFor: 60,
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
