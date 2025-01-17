export default function Loader() {
  return (
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500 border-opacity-50"></div>
  );
}

export const Loader1 = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="relative">
        <div className="animate-spin-slow rounded-full h-20 w-20 border-t-4 border-pink-500"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="h-10 w-10 text-pink-500 animate-pulse"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3"
            />
          </svg>
        </div>
      </div>
      <p className="mt-4 text-lg font-semibold text-gray-700">
        Please wait, processing your request...
      </p>
    </div>
  );
};
