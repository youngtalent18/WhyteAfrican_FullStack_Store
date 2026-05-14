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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={() => setModalOpen(false)}
    >
      <div
        className="
          relative w-full max-w-md
          max-h-[90vh] overflow-y-auto
          rounded-2xl
          p-5 sm:p-6
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={() => setModalOpen(false)}
          className="
            absolute top-3 right-3

            w-9 h-9
            flex items-center justify-center

            rounded-full
            bg-slate-800/60
            border border-slate-700

            text-slate-300
            hover:text-white
            hover:bg-slate-700

            transition
          "
        >
          ✕
        </button>

        {/* CONTENT */}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;