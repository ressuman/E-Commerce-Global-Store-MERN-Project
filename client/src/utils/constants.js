export const BASE_URL =
  import.meta.env.NODE_ENV === "development"
    ? "http://localhost:5330" // Local backend during development
    : "https://your-production-api.com"; // Replace with the production API URL

export const AUTH_URL = `${BASE_URL}/api/v1/auth`;
export const USERS_URL = `${BASE_URL}/api/v1/users`;
export const CATEGORY_URL = `${BASE_URL}/api/v1/category`;
export const PRODUCT_URL = `${BASE_URL}/api/v1/products`;
export const UPLOAD_URL = `${BASE_URL}/api/v1/upload`;
export const ORDERS_URL = `${BASE_URL}/api/v1/orders`;
export const PAYPAL_URL = `${BASE_URL}/api/v1/config/paypal`;
