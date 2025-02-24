import "./Navigation.css";
import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutUserMutation } from "../../../redux/api/authApiSlice";
import { logout } from "../../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import FavoritesCount from "../../Favorites/FavoritesCount";
import CartCount from "../../../components/CartCount";

export default function Navigation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const [logoutApiCall] = useLogoutUserMutation();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleMouseLeave = () => {
    // Close dropdown when leaving hover-triggered space
    setDropdownOpen(false);
  };

  // const toggleSidebar = () => {
  //   setShowSidebar(!showSidebar);
  // };

  // const closeSidebar = () => {
  //   setShowSidebar(false);
  // };

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap(); // Trigger API call to log out
      dispatch(logout()); // Reset auth state
      toast.success("User Logged out successfully.");
      navigate("/login"); // Redirect to login page
    } catch (err) {
      console.error("Logout failed:", err); // Log error for debugging
      toast.error("An error occurred during logout. Please try again.");
      // Optional: Show user-friendly error message
      // alert("An error occurred during logout. Please try again.");
    }
  };

  return (
    <div
      style={{ zIndex: 9999 }}
      className={`${
        showSidebar ? "hidden" : "flex"
      } xl:flex lg:flex md:hidden sm:hidden flex-col justify-between p-4 text-white bg-[#000] w-[8%] hover:w-[15%] h-screen fixed`}
      onMouseLeave={handleMouseLeave}
      id="navigation-container"
    >
      {/* Navigation Links */}
      <div className="flex flex-col justify-center space-y-4">
        <Link
          to="/"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <AiOutlineHome className="mr-2 mt-[3rem]" size={26} />
          <span className="hidden nav-item-name mt-[3rem]">HOME</span>
        </Link>

        <Link
          to="/shop"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <AiOutlineShopping className="mr-2 mt-[3rem]" size={26} />
          <span className="hidden nav-item-name mt-[3rem]">SHOP</span>
        </Link>
        <Link
          to="/cart"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <AiOutlineShoppingCart className="mr-2 mt-[3rem]" size={26} />
          <span className="hidden nav-item-name mt-[3rem]">CART</span>{" "}
          <CartCount />
        </Link>
        <Link
          to="/favorite"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <FaHeart className="mr-2 mt-[3rem]" size={26} />
          <span className="hidden nav-item-name mt-[3rem]">FAVORITES</span>{" "}
          <FavoritesCount />
        </Link>
      </div>

      {/* User Dropdown */}
      <div className="relative">
        <button
          onClick={toggleDropdown}
          aria-expanded={dropdownOpen}
          className="flex items-center text-gray-800 focus:outline-none"
        >
          {userInfo ? (
            <span className="text-white">{userInfo.username}</span>
          ) : null}
          {userInfo && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ml-1 transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
              />
            </svg>
          )}
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && userInfo && (
          <ul
            className={`absolute right-0 mt-1 space-y-2 bg-white text-gray-600 hover:text-gray-950 ${
              !userInfo.isAdmin ? "-top-20" : "-top-80"
            }`}
          >
            {userInfo.isAdmin && (
              <>
                <li>
                  <Link
                    to="/admin/dashboard"
                    className="block px-4 py-2 w-full hover:bg-gray-500"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/productsList"
                    className="block px-4 py-2 w-full hover:bg-gray-500"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/categoryList"
                    className="block px-4 py-2 w-full hover:bg-gray-500"
                  >
                    Categories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/orderList"
                    className="block px-4 py-2 w-full hover:bg-gray-500"
                  >
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/userList"
                    className="block px-4 py-2 w-full hover:bg-gray-500"
                  >
                    Users
                  </Link>
                </li>
              </>
            )}

            <li>
              <Link
                to="/profile"
                className="block px-4 py-2 w-full hover:bg-gray-500 hover:text-white"
              >
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={logoutHandler}
                className="block px-4 py-2 text-left w-full hover:bg-gray-500 hover:text-white"
              >
                Logout
              </button>
            </li>
          </ul>
        )}

        {/* Login/Register Links */}
        {!userInfo && (
          <ul className="mt-5 space-y-2">
            <li>
              <Link
                to="/login"
                className="flex items-center transition-transform transform hover:translate-x-2"
              >
                <AiOutlineLogin className="mr-2 mt-[1rem]" size={20} />
                <span className="hidden nav-item-name mt-[1rem]">LOGIN</span>
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="flex items-center transition-transform transform hover:translate-x-2"
              >
                <AiOutlineUserAdd className="mr-2 mt-[1rem]" size={20} />
                <span className="hidden nav-item-name mt-[1rem]">REGISTER</span>
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
