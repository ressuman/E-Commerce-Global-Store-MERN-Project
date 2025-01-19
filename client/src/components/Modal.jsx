import { useEffect, useRef } from "react";

export default function Modal({
  isOpen,
  onClose,
  children,
  title = "Update and Edit",
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Focus the modal when it opens
      modalRef.current?.focus();

      // Prevent background scrolling
      document.body.style.overflow = "hidden";

      // Close modal on "Esc" key press
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          onClose();
        }
      };
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.style.overflow = "auto";
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target.id === "modal-overlay") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    // <dialog
    //   className="fixed inset-0 flex items-center justify-center z-50"
    //   aria-labelledby="modal-title"
    //   ref={modalRef}
    // >
    //   <div
    //     className="fixed inset-0 bg-black opacity-50"
    //     onClick={onClose}
    //   ></div>
    //   <div className="relative bg-white p-6 rounded-lg shadow-lg z-10 w-3/4 md:w-1/2 lg:w-1/3">
    //     <div className="flex justify-between items-center mb-4">
    //       <h2 id="modal-title" className="text-lg font-semibold text-black">
    //         {title}
    //       </h2>
    //       <button
    //         onClick={onClose}
    //         className="text-black font-bold hover:text-gray-700 focus:outline-none"
    //         aria-label="Close Modal"
    //       >
    //         X
    //       </button>
    //     </div>
    //     <div>{children}</div>
    //   </div>
    // </dialog>
    <div
      id="modal-overlay"
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      onClick={handleOverlayClick}
      aria-hidden={!isOpen}
    >
      <div
        className="relative bg-white p-6 rounded-lg shadow-lg z-10 w-[30%]"
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-labelledby="modal-title"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 id="modal-title" className="text-lg font-semibold text-black">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-black font-bold hover:text-gray-700 focus:outline-none"
            aria-label="Close Modal"
          >
            ✖
          </button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[75vh]">{children}</div>

        {/* Optional Footer */}
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={onClose}
            className="py-2 px-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// export const Modal1 = ({ isOpen, onClose, children }) => {
//   // Prevent background scrolling when modal is open
//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "auto";
//     }
//     return () => {
//       document.body.style.overflow = "auto";
//     };
//   }, [isOpen]);

//   const handleOutsideClick = (e) => {
//     if (e.target.id === "modal-overlay") {
//       onClose();
//     }
//   };

//   return (
//     <>
//       {isOpen && (
//         <div
//           id="modal-overlay"
//           className="fixed inset-0 flex items-center justify-center z-50"
//           onClick={handleOutsideClick}
//           aria-hidden={!isOpen}
//         >
//           {/* Background overlay */}
//           <div className="fixed inset-0 bg-black opacity-50"></div>
//           {/* Modal content */}
//           <dialog
//             aria-labelledby="modal-title"
//             className="relative bg-white p-4 rounded-lg z-10 max-w-md w-full mx-4 text-right shadow-lg"
//           >
//             {/* Close button */}
//             <button
//               className="absolute top-2 right-2 text-black font-semibold hover:text-gray-700 focus:outline-none"
//               onClick={onClose}
//               aria-label="Close modal"
//             >
//               ✖
//             </button>
//             {children}
//             <h2 id="modal-title" className="sr-only">
//               Modal Title
//             </h2>
//             {children}
//           </dialog>{" "}
//         </div>
//       )}
//     </>
//   );
// };
