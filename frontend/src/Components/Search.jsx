import { useNavigate } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";

const Search = ({ search, setSearch }) => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!search.trim()) return;

    navigate(`/search?q=${encodeURIComponent(search)}`);
    setSearch("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex items-center"
    >
      {/* INPUT */}
      <div className="relative w-full">
        <SearchIcon
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="
            w-full pl-10 pr-3 py-2
            bg-slate-800
            text-white
            rounded-l-md
            border border-slate-700
            outline-none
            focus:border-indigo-500
            focus:ring-1 focus:ring-indigo-500
            transition
          "
        />
      </div>

      {/* BUTTON */}
      <button
        type="submit"
        className="
          px-4 py-2
          bg-indigo-600
          hover:bg-indigo-500
          text-white
          rounded-r-md
          transition
        "
      >
        <SearchIcon size={18} />
      </button>
    </form>
  );
};

export default Search;