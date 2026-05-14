import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductSkeleton from "../Components/ProductSkeleton";
import BackButton from "../Components/BackButton.jsx";
import ProductCard from "../Components/ProductCard.jsx";

const SearchPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("q");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;

      setLoading(true);
      try {
        const res = await api.get(`/products/search?q=${query}`);
        setProducts(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 sm:px-6 lg:px-10 py-8">
      
      <BackButton />

      {/* HEADER */}
      <div className="max-w-6xl mx-auto text-center mb-8">
        <h2 className="text-sm sm:text-base text-slate-400">
          Search results for
        </h2>

        <h1 className="text-xl sm:text-2xl font-semibold mt-1">
          <span className="text-emerald-400">"{query}"</span>
        </h1>

        <p className="text-xs text-slate-500 mt-2">
          Find the best matches from our catalog
        </p>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && products.length === 0 && (
        <div className="max-w-4xl mx-auto text-center mt-20">
          <p className="text-slate-400 text-base">
            No products found for this search
          </p>
          <p className="text-slate-600 text-sm mt-2">
            Try searching with different keywords
          </p>
        </div>
      )}

      {/* RESULTS */}
      {!loading && products.length > 0 && (
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;