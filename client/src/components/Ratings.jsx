import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

export default function Ratings({ value, text, color = "yellow-500" }) {
  // Validate and clamp the value between 0 and 5
  const clampedValue = Math.min(Math.max(Number(value), 0), 5);
  const fullStars = Math.floor(clampedValue);
  const hasHalfStar = clampedValue - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  // Color class mapping
  const colorClasses = {
    "yellow-500": "text-yellow-500",
    "pink-500": "text-pink-500",
    "orange-500": "text-orange-500",
  };

  // Fallback to yellow-500 if invalid color provided
  const textColor = colorClasses[color] || "text-yellow-500";

  return (
    <div
      className="flex items-center"
      role="img"
      aria-label={`Rating: ${clampedValue} out of 5`}
    >
      {[...Array(fullStars)].map((_, index) => (
        <FaStar
          key={`full-${index}`}
          className={`${textColor} ml-1`}
          aria-hidden="true"
        />
      ))}

      {hasHalfStar && (
        <FaStarHalfAlt className={`${textColor} ml-1`} aria-hidden="true" />
      )}

      {[...Array(emptyStars)].map((_, index) => (
        <FaRegStar
          key={`empty-${index}`}
          className={`${textColor} ml-1`}
          aria-hidden="true"
        />
      ))}

      {text && (
        <span className={`ml-2 ${textColor} text-sm font-medium`}>{text}</span>
      )}
    </div>
  );
}

Ratings.defaultProps = {
  color: "yellow-500",
};
