import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { NavLink } from "react-router";

export default function AdminMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Menu Button */}
      <button
        className={`fixed ${
          isMenuOpen ? "top-2 right-2" : "top-5 right-7"
        } bg-[#151515] p-2 rounded-lg z-50`}
        onClick={toggleMenu}
        aria-expanded={isMenuOpen}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMenuOpen ? (
          <FaTimes color="white" />
        ) : (
          <>
            <div className="w-6 h-0.5 bg-gray-200 my-1"></div>
            <div className="w-6 h-0.5 bg-gray-200 my-1"></div>
            <div className="w-6 h-0.5 bg-gray-200 my-1"></div>
          </>
        )}
      </button>

      {/* Menu Section */}
      {isMenuOpen && (
        <section className="bg-[#151515] p-4 fixed right-7 top-5 shadow-lg rounded-lg z-40 animate-slide-down">
          <ul className="list-none mt-2">
            {[
              {
                path: "/admin/dashboard",
                label: "Admin Dashboard",
              },
              {
                path: "/admin/categoryList",
                label: "Create Category",
              },
              {
                path: "/admin/productsList",
                label: "Create Product",
              },
              {
                path: "/admin/allProductsList",
                label: "All Products",
              },
              {
                path: "/admin/userList",
                label: "Manage Users",
              },
              {
                path: "/admin/orderList",
                label: "Manage Orders",
              },
            ].map((item) => (
              <li key={item.path}>
                <NavLink
                  className={({ isActive }) =>
                    `list-item py-2 px-3  mb-5 rounded-sm ${
                      isActive
                        ? "bg-[#2E2D2D] text-pink-500"
                        : "text-white hover:bg-[#2E2D2D]"
                    }`
                  }
                  to={item.path}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
