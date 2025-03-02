import { ORDERS_URL, PAYMENT_URL } from "../../utils/constants";
import { apiSlice } from "./apiSlice";

export const ordersAndPaymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: `${ORDERS_URL}/create-order`,
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Order"],
    }),

    findOrderById: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/get-order/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Order", id }],
      keepUnusedDataFor: 15,
    }),

    createStripePaymentIntent: builder.mutation({
      query: (orderId) => ({
        url: `${PAYMENT_URL}/create-payment-intent`,
        method: "POST",
        body: { orderId },
      }),
      invalidatesTags: ["Payment"],
    }),

    getUserOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/get-user-orders`,
      }),
      providesTags: ["Order"],
      keepUnusedDataFor: 5,
    }),

    getAllOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/fetch-all-orders`,
      }),
      providesTags: ["Order"],
    }),

    markOrderAsPaid: builder.mutation({
      query: (id) => ({
        url: `${ORDERS_URL}/get-order/${id}/pay`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Order", id: id }],
    }),

    markOrderDelivered: builder.mutation({
      query: (id) => ({
        url: `${ORDERS_URL}/get-order/${id}/deliver`,
        method: "PUT",
      }),
      invalidatesTags: ["Order"],
    }),

    countTotalOrders: builder.query({
      query: () => `${ORDERS_URL}/total-orders`,
      providesTags: ["Order"],
    }),

    calculateTotalSales: builder.query({
      query: () => `${ORDERS_URL}/total-sales`,
      providesTags: ["Order"],
    }),

    calculateTotalSalesByDate: builder.query({
      query: () => `${ORDERS_URL}/total-sales-by-date`,
      providesTags: ["Order"],
    }),

    // Webhook handling remains server-side only
  }),
  overrideExisting: false,
});

export const {
  useCreateOrderMutation,
  useFindOrderByIdQuery,
  useCreateStripePaymentIntentMutation,
  useGetUserOrdersQuery,
  useGetAllOrdersQuery,
  useMarkOrderAsPaidMutation,
  useMarkOrderDeliveredMutation,
  useCountTotalOrdersQuery,
  useCalculateTotalSalesQuery,
  useCalculateTotalSalesByDateQuery,
} = ordersAndPaymentApiSlice;
