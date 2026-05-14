import React, { useEffect } from "react";
import ProductCard from "./ProductCard";
import useProductStore from "../store/productStore";
import ProductSkeleton from "./ProductSkeleton";

const PeopleAlsoBought = () => {
  const {
    getRecommendations,
    recommendedProducts,
    loading,
  } = useProductStore();

  useEffect(() => {
    getRecommendations();
  }, [getRecommendations]);

  return (
    <div className="mt-8 px-2 sm:px-0">

      {/* TITLE */}
      <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-indigo-400">
        People Also Bought
      </h3>

      {/* GRID WRAPPER */}
      <div className="mt-5 sm:mt-6">

        {/* LOADING */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && recommendedProducts?.length === 0 && (
          <div className="flex items-center justify-center py-10 text-center">
            <p className="text-gray-400 text-sm sm:text-base">
              No recommendations available yet
            </p>
          </div>
        )}

        {/* PRODUCTS */}
        {!loading && recommendedProducts?.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {recommendedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default PeopleAlsoBought;