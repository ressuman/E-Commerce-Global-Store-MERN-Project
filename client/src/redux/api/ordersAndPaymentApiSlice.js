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

    createStripeCheckoutSession: builder.mutation({
      query: ({ userId, cartItems }) => ({
        url: `${PAYMENT_URL}/create-checkout-session`,
        method: "POST",
        body: {
          userId,
          cartItems: cartItems.map((item) => ({
            _id: item.product,
            name: item.name,
            image: item.image,
            price: item.price,
            qty: item.qty,
            description: item.description,
          })),
        },
      }),
      invalidatesTags: ["Order", "Payment"],
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
      query: ({ id, details }) => ({
        url: `${ORDERS_URL}/get-order/${id}/pay`,
        method: "PUT",
        body: details,
      }),
      invalidatesTags: (result, error, id) => [{ type: "Order", id }],
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
  useCreateStripeCheckoutSessionMutation,
  useGetUserOrdersQuery,
  useGetAllOrdersQuery,
  useMarkOrderAsPaidMutation,
  useMarkOrderDeliveredMutation,
  useCountTotalOrdersQuery,
  useCalculateTotalSalesQuery,
  useCalculateTotalSalesByDateQuery,
} = ordersAndPaymentApiSlice;
