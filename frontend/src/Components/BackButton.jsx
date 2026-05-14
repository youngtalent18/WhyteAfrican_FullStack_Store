import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="
        inline-flex items-center gap-2

        px-3 py-1.5
        rounded-md

        bg-slate-900
        border border-slate-800

        text-slate-300
        text-sm font-medium

        hover:bg-slate-800 hover:text-white
        transition

        active:scale-95
      "
    >
      <span>← Back</span>
    </button>
  );
};

export default BackButton;