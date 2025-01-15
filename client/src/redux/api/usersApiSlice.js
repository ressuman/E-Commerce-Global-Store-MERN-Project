import { USERS_URL } from "../../utils/constants";
import { apiSlice } from "./apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({
        url: `${USERS_URL}/get-profile`,
      }),
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/update-profile`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"], // Refreshes cached user data
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: `${USERS_URL}/get-all-users`,
      }),
      providesTags: ["User"],
      keepUnusedDataFor: 60, // Increased cache time for efficiency
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/delete-user/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"], // Ensures the user list is refreshed
    }),
    getUser: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/get-user/${id}`,
      }),
      providesTags: ["User"],
      keepUnusedDataFor: 60,
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/update-user/${data.userId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"], // Refreshes updated user data
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useGetUserQuery,
  useUpdateUserMutation,
} = userApiSlice;
