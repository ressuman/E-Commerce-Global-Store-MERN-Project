import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
} from "react-icons/fa";

export default function Message({ variant = "info", children }) {
  const getVariantClass = () => {
    switch (variant) {
      case "success":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "info":
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getIcon = () => {
    switch (variant) {
      case "success":
        return <FaCheckCircle className="mr-2" />;
      case "error":
        return <FaExclamationCircle className="mr-2" />;
      case "info":
      default:
        return <FaInfoCircle className="mr-2" />;
    }
  };

  return (
    <div
      className={`p-4 rounded flex items-center ${getVariantClass()}`}
      role="alert"
    >
      {getIcon()}
      {children}
    </div>
  );
}
