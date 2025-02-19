export default function PaginationControls({
  currentPage,
  totalPages,
  setPage,
}) {
  const maxVisiblePages = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-8 mb-6">
      <button
        onClick={() => setPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
        const pageNumber = startPage + i;
        return (
          <button
            key={pageNumber}
            onClick={() => setPage(pageNumber)}
            className={`px-4 py-2 rounded-lg ${
              currentPage === pageNumber
                ? "bg-pink-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {pageNumber}
          </button>
        );
      })}

      <button
        onClick={() => setPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}
