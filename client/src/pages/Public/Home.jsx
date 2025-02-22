import { Link, useParams } from "react-router-dom";
import Header from "../../components/Header";
import { useGetAllProductsQuery } from "../../redux/api/productsAndUploadApiSlice";
import { Loader1 } from "../../components/Loader";
import Message from "../../components/Message";
import ProductsGrid from "../Products/ProductsGrid";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Home() {
  const { keyword } = useParams();

  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const { data = [], isLoading, isError } = useGetAllProductsQuery({ keyword });

  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    if (data.length > 0) {
      const endIndex = page * ITEMS_PER_PAGE;
      const productsToShow = data.slice(0, endIndex);
      setDisplayedProducts(productsToShow);
      setHasMore(endIndex < data.length);
    }
  }, [page, data]);

  const fetchMoreData = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  if (isLoading) {
    return <Loader1 />;
  }

  if (isError || !data.length) {
    return (
      <div className="text-center text-red-500 p-6">
        Failed to load products or no products found. Please try again later.
      </div>
    );
  }

  return (
    <>
      {/* Conditional Header */}
      {!keyword && <Header />}

      {/* Main Content */}
      {(() => {
        if (isLoading) {
          return <Loader1 />;
        } else if (isError) {
          return (
            <Message variant="danger">
              {isError?.data?.message ||
                isError.error ||
                "Error loading products"}
            </Message>
          );
        } else {
          return (
            <>
              {/* Special Products Header */}
              <div className="flex justify-between items-center">
                <h1 className="ml-[20rem] mt-[10rem] text-[3rem]">
                  Special Products
                </h1>
                <Link
                  to="/shop"
                  className="bg-pink-600 font-bold rounded-full py-2 px-10 mr-[18rem] mt-[10rem] hover:bg-pink-700 transition-colors duration-200"
                >
                  Shop Now
                </Link>
              </div>

              {/* Products Grid */}
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
                {" "}
                <div className="flex justify-center flex-wrap mt-[2rem] gap-8 ml-[11%] mr-[2%]">
                  {data?.map((product) => (
                    <ProductsGrid key={product._id} product={product} />
                  ))}
                </div>
              </InfiniteScroll>

              {/* Empty State */}
              {data?.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-600 mb-4">
                    No products found
                  </p>
                  <Link
                    to="/admin/allProductsList"
                    className="bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-full py-3 px-8 transition-colors duration-200"
                  >
                    Browse All Products
                  </Link>
                </div>
              )}
            </>
          );
        }
      })()}
    </>
  );
}
