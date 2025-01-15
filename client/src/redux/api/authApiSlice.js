import { AUTH_URL } from "../../utils/constants";
import { apiSlice } from "./apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/signin`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"], // Invalidates cached authentication state
    }),
    createUser: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/signup`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"], // Refresh user data after creation
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: `${AUTH_URL}/signout`,
        method: "POST",
      }),
      invalidatesTags: ["Auth", "User"], // Clears authentication and user data
    }),
  }),
});

export const {
  useLoginUserMutation,
  useCreateUserMutation,
  useLogoutUserMutation,
} = authApiSlice;
