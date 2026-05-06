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
    <div className="p-4 text-white">
    <BackButton />
      <h2 className="text-sm text-center mb-3 text-slate-400">
        Results for: <span className="text-green-400">{query}</span>
      </h2>

      {loading && 
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
        </div>
      }

      {!loading && products.length === 0 && (
        <p className="text-center text-gay-300 text-md">No products found</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;