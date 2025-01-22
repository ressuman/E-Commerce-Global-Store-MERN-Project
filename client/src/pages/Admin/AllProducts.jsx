import { Link } from "react-router";
import { useGetAllProductsQuery } from "../../redux/api/productsAndUploadApiSlice";
import moment from "moment";
import AdminMenu from "./AdminMenu";
import { Loader1 } from "../../components/Loader";

export default function AllProducts() {
  const { data: products = [], isLoading, isError } = useGetAllProductsQuery();

  if (isLoading) {
    return <Loader1 />;
  }

  if (isError || !products.length)
    return (
      <div className="text-center text-red-500">
        Failed to load products or no products found. Please try again later.
      </div>
    );

  return (
    <div className="container ml-48">
      <div className="mx-auto">
        <div className="flex flex-col md:flex-row">
          <div className="p-3">
            <h1 className="font-bold h-12 text-4xl mb-4 text-center">
              All Products ({products?.length || 0})
            </h1>
            <div className="flex flex-wrap justify-around items-center">
              {products?.length === 0 ? (
                <h2 className="text-center text-red-500">
                  No products found. Please add some products.button
                </h2>
              ) : (
                products?.map((product) => (
                  <Link
                    key={product._id}
                    to={`/admin/product/update/${product._id}`}
                    className="block mb-4 overflow-hidden hover:shadow-2xl transition-shadow duration-200"
                  >
                    <div className="flex">
                      <img
                        src={product.image || "/placeholder.png"}
                        alt={product.name || "Product Image"}
                        className="w-[10rem] object-cover"
                      />
                      <div className="p-4 flex flex-col justify-around">
                        <div className="flex justify-between">
                          <h5 className="text-xl font-semibold mb-2 truncate">
                            {product?.name || "Unnamed Product"}
                          </h5>
                          <p className="text-gray-400 text-xs">
                            {product.createdAt
                              ? moment(product.createdAt).format("MMMM Do YYYY")
                              : "Date not available"}
                          </p>
                        </div>
                        <p className="text-gray-400 text-sm mb-4 xl:w-[30rem] lg:w-[30rem] md:w-[20rem] sm:w-[10rem]">
                          {product?.description
                            ? `${product.description.substring(0, 160)}...`
                            : "No description available."}
                        </p>
                        <div className="flex justify-between">
                          <button
                            // to={`/admin/product/update/${product._id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `/admin/product/update/${product._id}`;
                            }}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-pink-700 rounded-lg hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800"
                          >
                            Update Product
                            <svg
                              className="w-3.5 h-3.5 ml-2"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 14 10"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M1 5h12m0 0L9 1m4 4L9 9"
                              />
                            </svg>
                          </button>
                          <p>
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(product?.price) || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
          <div className="md:w-1/4 p-3 mt-2">
            <AdminMenu />
          </div>
        </div>
      </div>
    </div>
  );
}
