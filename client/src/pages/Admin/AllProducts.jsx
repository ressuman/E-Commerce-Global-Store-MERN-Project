import { Link } from "react-router";
import { useGetAllProductsQuery } from "../../redux/api/productsAndUploadApiSlice";
import moment from "moment";
import AdminMenu from "./AdminMenu";
import { Loader1 } from "../../components/Loader";
import InfiniteScroll from "react-infinite-scroll-component";
import { useState, useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export default function AllProducts() {
  const { data: products = [], isLoading, isError } = useGetAllProductsQuery();

  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // Client-side pagination config
  const ITEMS_PER_PAGE = 12;
  const PLACEHOLDER_IMAGE =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII=";

  useEffect(() => {
    if (products.length > 0) {
      const endIndex = page * ITEMS_PER_PAGE;
      const productsToShow = products.slice(0, endIndex);
      setDisplayedProducts(productsToShow);
      setHasMore(endIndex < products.length);
    }
  }, [page, products]);

  const fetchMoreData = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  if (isLoading) {
    return <Loader1 />;
  }

  if (isError || !products.length) {
    return (
      <div className="text-center text-red-500 p-6">
        Failed to load products or no products found. Please try again later.
      </div>
    );
  }

  return (
    <div className="container">
      <div className="ml-[15%] mr-[2%] mt-4">
        <div className="flex">
          <div className="flex-1">
            <h1 className="font-bold h-12 text-4xl mb-10 text-center">
              All Products ({products?.length || 0})
            </h1>
            <InfiniteScroll
              dataLength={displayedProducts.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={<Loader1 />}
              endMessage={
                <p className="text-center text-gray-500 py-4">
                  You&#39;ve viewed all products
                </p>
              }
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {displayedProducts?.length === 0 ? (
                  <h2 className="text-center text-red-500">
                    No products found. Please add some products.button
                  </h2>
                ) : (
                  displayedProducts?.map((product) => (
                    <Link
                      key={product._id}
                      to={`/admin/product/update/${product._id}`}
                      className="block mb-4 overflow-hidden hover:shadow-2xl transition-shadow duration-200 rounded-lg w-full"
                    >
                      <div className="flex gap-3 justify-center">
                        <div className="w-[30%] mb-[-6px]">
                          <LazyLoadImage
                            src={product.image || "/placeholder.png"}
                            alt={product.name}
                            className="w-40 h-40 object-cover rounded-lg"
                            effect="blur"
                            placeholderSrc={PLACEHOLDER_IMAGE}
                            threshold={100}
                          />
                        </div>

                        <div className="w-[70%] flex flex-col justify-between pr-2">
                          <div className="flex justify-between items-center gap-4">
                            <h5 className="text-[1.25rem] font-semibold">
                              {product?.name || "Unnamed Product"}
                            </h5>
                            <p className="text-gray-400 text-[0.75rem]">
                              {product.createdAt
                                ? moment(product.createdAt).format(
                                    "MMMM Do YYYY"
                                  )
                                : "Date not available"}
                            </p>
                          </div>
                          <p className="text-gray-400 text-sm">
                            {product?.description
                              ? `${product.description.substring(0, 160)}...`
                              : "No description available."}
                          </p>
                          <div className="flex justify-between items-center gap-3">
                            <div className="flex justify-between">
                              <button
                                // to={`/admin/product/update/${product._id}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.location.href = `/admin/product/update/${product._id}`;
                                }}
                                className="inline-flex items-center px-3 py-2 text-xs font-medium text-center text-white bg-pink-700 rounded-lg hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800"
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
                            </div>

                            <div className="flex justify-between items-center gap-3">
                              <span className="text-lg font-bold text-pink-600">
                                {new Intl.NumberFormat("en-US", {
                                  style: "currency",
                                  currency: "USD",
                                }).format(product?.price || "N/A")}
                              </span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  product?.countInStock > 0
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {product?.countInStock || "N/A"} in stock
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </InfiniteScroll>
          </div>
          <div className="w-[13%] mt-2">
            <AdminMenu />
          </div>
        </div>
      </div>
    </div>
  );
}
