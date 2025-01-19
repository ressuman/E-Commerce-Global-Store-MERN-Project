import { CATEGORY_URL } from "../../utils/constants";
import { apiSlice } from "./apiSlice";

export const categoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (newCategory) => ({
        url: `${CATEGORY_URL}/create-category`,
        method: "POST",
        body: newCategory,
      }),
      invalidatesTags: ["Category"], // Invalidate cache for fetchCategories
    }),

    updateCategory: builder.mutation({
      query: ({ categoryId, updatedCategory }) => ({
        url: `${CATEGORY_URL}/update-category/${categoryId}`,
        method: "PUT",
        body: updatedCategory,
      }),
      invalidatesTags: ["Category"], // Invalidate cache
    }),

    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `${CATEGORY_URL}/delete-category/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"], // Invalidate cache
    }),

    getCategories: builder.query({
      query: () => ({
        url: `${CATEGORY_URL}/fetch-categories`,
        method: "GET",
      }),
      providesTags: ["Category"], // Tag to manage cache invalidation
      keepUnusedDataFor: 60,
    }),

    getCategory: builder.query({
      query: (categoryId) => ({
        url: `${CATEGORY_URL}/get-category/${categoryId}`,
        method: "GET",
      }),
      providesTags: ["Category"], // Tag to manage cache invalidation
      keepUnusedDataFor: 60,
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoryQuery,
} = categoriesApiSlice;
