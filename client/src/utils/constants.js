export const BASE_URL =
  import.meta.env.VITE_REACT_CLIENT_BASE_URL || "http://localhost:5173";

export const AUTH_URL = `${BASE_URL}/api/v1/auth`;
export const USERS_URL = `${BASE_URL}/api/v1/users`;
export const CATEGORY_URL = `${BASE_URL}/api/v1/category`;
export const PRODUCT_URL = `${BASE_URL}/api/v1/products`;
export const UPLOAD_URL = `${BASE_URL}/api/v1/media`;
export const ORDERS_URL = `${BASE_URL}/api/v1/orders`;
export const PAYMENT_URL = `${BASE_URL}/api/v1/config/stripe`;
