export default function CategoryForm({
  value,
  setValue,
  handleSubmit,
  buttonText = "Submit",
  handleDelete,
  isSubmitting = false,
  isDeleting = false,
}) {
  return (
    <div className="p-3">
      <form onSubmit={handleSubmit} className="space-y-3">
        <label
          htmlFor="categoryName"
          className="sr-only block text-sm font-medium text-gray-700"
        >
          Category Name
        </label>
        <input
          id="categoryName"
          type="text"
          className={`py-3 px-4 border rounded-lg w-full ${
            !value.trim() ? "border-pink-500" : "border-pink-700"
          }`}
          placeholder="Write category name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label="Category Name"
        />

        <div className="flex justify-between items-center">
          <button
            className={`bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={!value.trim() || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : buttonText}
          </button>

          {handleDelete && (
            <button
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className={`bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 ${
                isDeleting ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isDeleting}
              aria-label="Delete Category"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
