import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import FloatingContact from "../Components/ContactUs.jsx";
import ProductCard from "../Components/ProductCard";
import useProductStore from "../store/productStore";
import BackButton from "../Components/BackButton";
import ProductSkeleton from "../Components/ProductSkeleton.jsx";

const CategoryPage = ({ search }) => {
  const { getCategoryProducts, categoryProducts, loading } =
    useProductStore();

  const { category } = useParams();

  // FETCH
  useEffect(() => {
    if (category) {
      getCategoryProducts(category);
    }
  }, [category, getCategoryProducts]);

  // FILTER
  const filteredProducts = useMemo(() => {
    return categoryProducts?.filter((p) =>
      search ? p.name.toLowerCase().includes(search.toLowerCase()) : true
    );
  }, [categoryProducts, search]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 py-4 sm:py-6">
      <FloatingContact />

      {/* BACK BUTTON */}
        <BackButton />
  

      {/* TITLE */}
      <motion.h1
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: -10 }}
        transition={{ duration: 0.8 }}
        className="text-md sm:text-2xl md:text-3xl font-bold text-center text-white"
      >
        {category?.charAt(0).toUpperCase() + category?.slice(1)}
      </motion.h1>

      <p className="text-center text-gray-400 text-xs sm:text-sm mt-1 px-2">
        Explore our exclusive collection of {category} products.
      </p>

      {/* LOADING STATE */}
      {loading && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      )}

      {/* PRODUCTS */}
      {!loading && (
        <>
          {filteredProducts?.length === 0 ? (
            <div className="min-h-[40vh] flex items-center justify-center text-center">
              <p className="text-gray-500 text-sm sm:text-base">
                No products found in this category.
              </p>
            </div>
          ) : (
            <div
              className="
                mt-5 sm:mt-6
                grid
                grid-cols-2
                sm:grid-cols-3
                lg:grid-cols-4
                xl:grid-cols-5
                gap-3 sm:gap-4
              "
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryPage;