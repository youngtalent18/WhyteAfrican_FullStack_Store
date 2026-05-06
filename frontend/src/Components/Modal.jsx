import React, { useEffect } from "react";

const Modal = ({ isModalOpen, setModalOpen, children }) => {
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    const handleEsc = (e) => {
      if (e.key === "Escape") setModalOpen(false);
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isModalOpen, setModalOpen]);

  if (!isModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4"
      onClick={() => setModalOpen(false)}
    >
      <div
        className="
          relative
          w-full
          max-w-sm sm:max-w-md
          max-h-[90vh]
          overflow-y-auto
          bg-slate-100
          text-gray-900
          rounded-xl sm:rounded-2xl
          shadow-2xl
          p-4 sm:p-6
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={() => setModalOpen(false)}
          className="
            absolute top-3 right-3
            text-gray-600 hover:text-black
            text-xl sm:text-2xl
            w-8 h-8 flex items-center justify-center
            rounded-full hover:bg-gray-200
            transition
          "
        >
          ✕
        </button>

        <div className="mt-6 sm:mt-2">{children}</div>
      </div>
    </div>
  );
};

export default Modal;