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
    <form onSubmit={handleSubmit} className="w-full flex items-center">
      
      {/* INPUT */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products..."
        className="w-full px-3 py-2 border border-gray-300 rounded-l bg-slate-700 text-white outline-none"
      />

      {/* MOBILE BUTTON (VISIBLE ON SMALL SCREENS) */}
      <button
        type="submit"
        className="sm:hidden px-3 py-2 bg-green-600 text-white rounded-r"
      >
        <SearchIcon size={18} />
      </button>

      {/* DESKTOP BUTTON (OPTIONAL – HIDDEN OR VISIBLE) */}
      <button
        type="submit"
        className="hidden sm:flex px-4 py-2 bg-green-500 text-white rounded-r hover:bg-green-400 cursor-pointer"
      >
        Search
      </button>
    </form>
  );
};

export default Search;