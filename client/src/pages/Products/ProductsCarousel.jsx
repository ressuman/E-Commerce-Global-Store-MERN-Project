import Message from "../../components/Message";
import { useGetTopProductsQuery } from "../../redux/api/productsAndUploadApiSlice";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import {
  FaBox,
  FaClock,
  FaComment,
  FaShoppingCart,
  FaStar,
  FaStore,
  FaTags,
} from "react-icons/fa";
import { Loader1 } from "../../components/Loader";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export default function ProductsCarousel() {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    adaptiveHeight: true,
  };

  let content;

  if (isLoading) {
    content = (
      <div className="flex justify-center items-center h-96">
        <Loader1 />
      </div>
    );
  } else if (error) {
    content = (
      <Message variant="error">
        {error?.data?.message || error.error || "Failed to load products"}
      </Message>
    );
  } else if (!products || products.length === 0) {
    content = <Message variant="info">No products available</Message>;
  } else {
    content = (
      <Slider {...settings} className=" sm:block">
        {products?.map(
          ({
            image,
            _id,
            name,
            price,
            description,
            brand,
            createdAt,
            numReviews,
            rating,
            quantity,
            countInStock,
            category,
          }) => (
            <div key={_id}>
              {/* Image Section */}
              {/* <img
                src={image}
                alt={name}
                className="w-full rounded-lg object-cover h-[28rem]"
              /> */}
              <LazyLoadImage
                src={image}
                alt={name}
                className="w-[43rem] rounded-lg object-cover h-[28rem]"
                effect="blur"
                //placeholderSrc={PLACEHOLDER_IMAGE}
                threshold={100}
              />
              {/* Product Details */}
              <div className="mt-4 grid grid-cols-[35%_65%] gap-2">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{name}</h2>
                  <p className="text-xl text-pink-600 font-semibold">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(price || "N/A")}
                  </p>{" "}
                  <br /> <br />
                  <p className="text-gray-600 ">
                    {description.substring(0, 150)} ...
                  </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[45%_55%] gap-1">
                  {/* Left Column */}
                  <div>
                    {/* Brand */}
                    <div className="flex items-center mb-4 p-2 rounded-lg">
                      <FaStore className="text-orange-500 mr-2" />
                      <span className="text-gray-700 font-semibold">
                        Brand:{" "}
                      </span>
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm">
                        {brand}
                      </span>
                    </div>
                    {/* Added */}
                    <div className="flex items-center mb-4 p-2 rounded-lg">
                      <FaClock className="text-indigo-500 mr-2" />
                      <span className="text-gray-700 font-semibold">
                        Added:{" "}
                      </span>
                      <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm">
                        {moment(createdAt).fromNow()}
                      </span>
                    </div>
                    {/* Reviews */}
                    <div className="flex items-center mb-4 p-2 rounded-lg">
                      <FaComment className="text-pink-500 mr-2" />
                      <span className="text-gray-700 font-semibold">
                        Reviews:{" "}
                      </span>
                      <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-sm">
                        {numReviews}
                      </span>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    {/* Rating */}
                    <div className="flex items-center mb-1 p-2 rounded-lg">
                      <FaStar className="text-yellow-400 mr-2" />
                      <span className="text-gray-700 font-semibold">
                        Rating:{" "}
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                          {Math.round(rating)}
                        </span>
                      </span>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center mb-1 p-2 rounded-lg">
                      <FaShoppingCart className="text-blue-500 mr-2" />
                      <span className="text-gray-700 font-semibold">
                        Quantity:{" "}
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                          {quantity}
                        </span>
                      </span>
                    </div>
                    {/* In Stock */}
                    <div className="flex items-center mb-1 p-2 rounded-lg">
                      <FaBox className="text-green-500 mr-2" />
                      <span className="text-gray-700 font-semibold">
                        In Stock:{" "}
                        <span
                          className={`${
                            countInStock > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          } px-2 py-1 rounded-full text-sm`}
                        >
                          {countInStock}
                        </span>
                      </span>
                    </div>
                    {/* Category */}
                    <div className="flex items-center mb-1 p-2 rounded-lg">
                      <FaTags className="text-purple-500 mr-2" />
                      <span className="text-gray-700 font-semibold">
                        Category:{" "}
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
                          {category?.name || "Uncategorized"}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </Slider>
    );
  }

  return <div className="mb-4 lg:block xl:block md:block">{content}</div>;
}
