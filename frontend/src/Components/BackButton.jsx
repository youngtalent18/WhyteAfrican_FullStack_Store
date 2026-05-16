import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackButton = ({ label = "Back", className = "" }) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className={`inline-flex items-center gap-2 rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-indigo-500/40 hover:bg-slate-800 hover:text-white active:scale-95 ${className}`}
    >
      <ArrowLeft size={16} />
      <span>{label}</span>
    </button>
  );
};

export default BackButton;