import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store/store.js";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Profile from "./pages/User/Profile.jsx";
import AdminPrivateRoute from "./components/AdminPrivateRoute.jsx";
import UserList from "./pages/Admin/UserList.jsx";
import CategoryList from "./pages/Admin/CategoryList.jsx";
import ProductsList from "./pages/Admin/ProductsList.jsx";
import ProductsUpdate from "./pages/Admin/ProductsUpdate.jsx";
import AllProducts from "./pages/Admin/AllProducts.jsx";

// Router Configuration
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* <Route index element={<Home />} />
      <Route path="/favorite" element={<Favorites />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/shop" element={<Shop />} /> */}

      {/* Protected Routes for Registered Users */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
        {/* <Route path="/shipping" element={<Shipping />} />
        <Route path="/placeorder" element={<PlaceOrder />} />
        <Route path="/order/:id" element={<Order />} /> */}
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminPrivateRoute />}>
        {/* <Route path="dashboard" element={<AdminDashboard />} /> */}
        <Route path="userList" element={<UserList />} />
        <Route path="categoryList" element={<CategoryList />} />
        <Route path="productsList" element={<ProductsList />} />
        <Route path="allProductsList" element={<AllProducts />} />
        {/* <Route path="productlist/:pageNumber" element={<ProductList />} /> */}
        <Route path="product/update/:_id" element={<ProductsUpdate />} />
        {/* <Route path="orderlist" element={<OrderList />} /> */}
      </Route>
    </Route>
  )
);

// Rendering
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      {/* <PayPalScriptProvider> */}
      <RouterProvider router={router} />
      {/* </PayPalScriptProvider> */}
    </Provider>
  </StrictMode>
);
