import { useState } from "react";
import { useGetTopProductsQuery } from "../../redux/api/productsAndUploadApiSlice";
import { FaComment, FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Loader1 } from "../../components/Loader";
import SmallProducts from "./SmallProducts";
import moment from "moment";

export default function ProductsTab({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) {
  const { data: relatedProducts, isLoading } = useGetTopProductsQuery();

  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  // Rating display logic
  const renderStars = (currentRating) => {
    const clampedValue = Math.min(Math.max(currentRating, 0), 5);
    const fullStars = Math.floor(clampedValue);
    const hasHalfStar = clampedValue - fullStars >= 0.5;

    return (
      <div
        className="flex items-center"
        aria-label={`Rating: ${clampedValue} out of 5`}
      >
        {[...Array(fullStars)].map((_, index) => (
          <FaStar key={`full-${index}`} className="text-yellow-400 w-4 h-4" />
        ))}
        {hasHalfStar && <FaStarHalfAlt className="text-yellow-400 w-4 h-4" />}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, index) => (
          <FaRegStar key={`empty-${index}`} className="text-gray-300 w-4 h-4" />
        ))}
        <span className="ml-2 text-sm text-gray-400">
          {new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          }).format(clampedValue)}
        </span>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 mt-8 w-full">
      {/* Tab Navigation */}
      <div className="flex flex-col gap-2 min-w-[200px]">
        <button
          className={`p-4 text-left rounded-lg transition-colors ${
            activeTab === 1
              ? "bg-pink-100 text-pink-800 font-bold border-l-4 border-pink-600"
              : "hover:bg-gray-800"
          }`}
          onClick={() => handleTabClick(1)}
          aria-selected={activeTab === 1}
          role="tab"
        >
          Write Your Review
        </button>
        <button
          className={`p-4 text-left rounded-lg transition-colors ${
            activeTab === 2
              ? "bg-pink-100 text-pink-800 font-bold border-l-4 border-pink-600"
              : "hover:bg-gray-800"
          }`}
          onClick={() => handleTabClick(2)}
          aria-selected={activeTab === 2}
          role="tab"
        >
          All Reviews ({product.reviews.length})
        </button>
        <button
          className={`p-4 text-left rounded-lg transition-colors ${
            activeTab === 3
              ? "bg-pink-100 text-pink-800 font-bold border-l-4 border-pink-600"
              : "hover:bg-gray-800"
          }`}
          onClick={() => handleTabClick(3)}
          aria-selected={activeTab === 3}
          role="tab"
        >
          Top Products
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {/* Write Review Tab */}
        {activeTab === 1 && (
          <div className="bg-gray-800 p-6 rounded-lg">
            {userInfo ? (
              <form onSubmit={submitHandler} className="space-y-4">
                <div>
                  <label
                    htmlFor="rating"
                    className="block text-lg mb-2 text-gray-300"
                  >
                    Select Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        className={`p-2 rounded-lg ${
                          rating >= value
                            ? "bg-pink-600 text-white"
                            : "bg-gray-700 text-gray-300"
                        }`}
                      >
                        <FaStar className="w-6 h-6" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="comment"
                    className="block text-lg mb-2 text-gray-300"
                  >
                    Your Review
                  </label>
                  <textarea
                    id="comment"
                    rows="2"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-3 bg-gray-700 rounded-lg text-gray-300 focus:ring-2 focus:ring-pink-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loadingProductReview}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loadingProductReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            ) : (
              <p className="text-gray-300">
                Please{" "}
                <Link to="/login" className="text-pink-500 hover:underline">
                  sign in
                </Link>{" "}
                to write a review
              </p>
            )}
          </div>
        )}

        {/* All Reviews Tab */}
        {activeTab === 2 && (
          <div className="space-y-6">
            {product.reviews.length === 0 ? (
              <p className="text-gray-400">No reviews yet</p>
            ) : (
              product.reviews.map((review) => (
                <div key={review._id} className="bg-gray-800 p-6 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-300">
                        {review.name}
                      </h4>
                      {/* <Ratings value={review.rating} color="pink-500" /> */}{" "}
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-gray-400">
                      {moment(review.createdAt).format("MMM D, YYYY")}
                    </span>
                  </div>
                  <div className="flex justify-start items-center gap-2">
                    <FaComment className="text-pink-500" />
                    <p className="text-gray-300"> {review.comment}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Related Products Tab */}
        {activeTab === 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <Loader1 />
            ) : relatedProducts && relatedProducts.length > 0 ? (
              relatedProducts.map((product) => (
                <SmallProducts key={product._id} product={product} />
              ))
            ) : (
              <p className="text-gray-400">No related products found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
