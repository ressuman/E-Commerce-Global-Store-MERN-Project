import ProductsCarousel from "../pages/Products/ProductsCarousel";
import SmallProducts from "../pages/Products/SmallProducts";
import { useGetTopProductsQuery } from "../redux/api/productsAndUploadApiSlice";
import { Loader1 } from "./Loader";

export default function Header() {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  return (
    <div className="container">
      <div className="flex justify-around ml-[10%] mr-[2%] mt-6 gap-6">
        <div className="xl:block lg:hidden md:hidden sm:hidden w-[50%]">
          <div className="grid grid-cols-2 gap-1">
            {isLoading && <Loader1 />}

            {error && !isLoading && (
              <div className="text-red-500 text-center">
                Error loading featured products
              </div>
            )}
            {!isLoading &&
              !error &&
              products?.map((product) => (
                <div key={product._id}>
                  <SmallProducts product={product} />
                </div>
              ))}
          </div>
        </div>

        <div className="w-[50%]">
          <ProductsCarousel />
        </div>
      </div>
    </div>
  );
}
