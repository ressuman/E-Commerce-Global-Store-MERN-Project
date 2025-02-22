import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import HeartIcon from "../../components/HeartIcon";

export default function SmallProducts({ product }) {
  const PLACEHOLDER_IMAGE =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII=";

  return (
    <div className="px-3">
      <div className="relative">
        {/* <img
          src={product?.image}
          alt={product?.name}
          className="h-auto rounded"
        /> */}
        <LazyLoadImage
          src={product?.image || "/placeholder.png"}
          alt={product?.name}
          className="w-72 h-60 object-cover rounded-lg"
          effect="blur"
          placeholderSrc={PLACEHOLDER_IMAGE}
          threshold={100}
        />
        <HeartIcon product={product} />
      </div>

      <div className="p-4">
        <Link to={`/product/${product?._id}`}>
          <h2 className="flex justify-between items-center">
            <div>{product?.name}</div>
            <span className="bg-pink-100 text-pink-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(product?.price || "N/A")}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
}
