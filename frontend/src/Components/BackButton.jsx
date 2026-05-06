import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="
        fixed
        top-32 sm:top-30 lg:top-24
        left-4 sm:left-4
        z-50

        flex items-center gap-1 sm:gap-2

        px-1 sm:px-3 py-1.5 sm:py-1

        rounded-2xl

        bg-white/90 backdrop-blur-md
        border border-white/40

        text-gray-800
        text-xs sm:text-sm font-medium

        shadow-md sm:shadow-lg

        hover:bg-white
        hover:shadow-xl

        active:scale-95
        transition
        cursor-pointer
      "
    >
      <span className="sm:text-sm">← Back</span>
    </button>
  );
};

export default BackButton;