import { Link, useParams } from "react-router-dom";
import Header from "../../components/Header";
import { useGetAllProductsQuery } from "../../redux/api/productsAndUploadApiSlice";
import { Loader1 } from "../../components/Loader";
import Message from "../../components/Message";

export default function Home() {
  const { keyword } = useParams();

  const { data, isLoading, isError } = useGetAllProductsQuery({ keyword });

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
              <div className="flex justify-center flex-wrap mt-[2rem]">
                {/* {data?.products?.map((product) => (
                    <Product key={product._id} product={product} />
                  ))} */}
              </div>

              {/* Empty State */}
              {data?.products?.length === 0 && (
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
