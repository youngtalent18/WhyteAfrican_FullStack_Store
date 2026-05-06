// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Feature from "../Components/Feature";
import Sort from "../Components/Sort";
import useProductStore from "../store/productStore";
import { useEffect, useState, useMemo, useRef } from "react";
import userStore from "../store/userStore";
import Footer from "../Components/Footer";
import ProductSkeleton from "../Components/ProductSkeleton";
import ProductCard from "../Components/ProductCard";
import FeaturedProduct from "../Components/FeaturedProducts";
import CategoryCard from "../Components/CategoryCard";
import FloatingContact from "../Components/ContactUs.jsx";

const Home = ({ search }) => {
  const { products, fetchAllProducts, loading } = useProductStore();
  const { user } = userStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  const [category, setCategory] = useState("All");
  const [sortOption, setSortOption] = useState("");

  const filteredProducts = useMemo(() => {
    return [...products]
      .filter((p) =>
        search ? p.name.toLowerCase().includes(search.toLowerCase()) : true
      )
      .filter((p) =>
        category === "All"
          ? true
          : p.category.toLowerCase() === category.toLowerCase()
      )
      .sort((a, b) => {
        if (sortOption === "price-low") return a.price - b.price;
        if (sortOption === "price-high") return b.price - a.price;
        return 0;
      });
  }, [products, search, category, sortOption]);

  const categories = [
    {id: "1", href: "bags", name: "Bags", imageUrl: "/bagB.avif" },
    {id: "2", href: "kids", name: "Kids", imageUrl: "/kid_banner.png" },
    {id: "3", href: "men", name: "Men", imageUrl: "/men_banner.png" },
    {id: "4", href: "women", name: "Women", imageUrl: "/Women.jpeg" },
    {id: "5", href: "perfumes", name: "Perfumes", imageUrl: "/perfumeB.avif" },
    {id: "6", href: "shoes", name: "Shoes", imageUrl: "/shoeBanner.avif" },
    {id: "7", href: "jackets", name: "Jackets", imageUrl: "/hoodieBanner.avif" },
    {id: "8", href: "caps", name: "Caps", imageUrl: "/cap1.avif" },
  ];

  const sliderRef = useRef(null);
  const isInteracting = useRef(false);

  const [currentIndex, setCurrentIndex] = useState(0);

  // 🔥 AUTOPLAY
  useEffect(() => {
    const interval = setInterval(() => {
      if (!sliderRef.current || isInteracting.current) return;

      const container = sliderRef.current;
      const width = container.clientWidth;

      const nextIndex = (currentIndex + 1) % categories.length;

      container.scrollTo({
        left: width * nextIndex,
        behavior: "smooth",
      });

      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, categories.length]);

  // 🔥 SCROLL TRACKING
  const handleScroll = () => {
    if (!sliderRef.current) return;

    const container = sliderRef.current;
    const width = container.clientWidth;

    const index = Math.round(container.scrollLeft / width);
    setCurrentIndex(index);
  };

  // 🔥 TOUCH HANDLING
  const handleTouchStart = () => {
    isInteracting.current = true;
  };

  const handleTouchEnd = () => {
    setTimeout(() => {
      isInteracting.current = false;
    }, 3000);
  };

  return (
    <div className="min-h-screen w-full pb-10">
      <FloatingContact />

      {/* HERO */}
      <div className="bg-slate-800 border-b border-slate-600 px-3 py-4">

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm md:text-2xl font-bold text-center"
        >
          {user ? (
            <>
              Hi{" "}
              <span className="text-emerald-400 font-extrabold underline">
                {user.name}
              </span>
              , Explore Our Categories
            </>
          ) : (
            "Welcome to WhyteAfrican Shop"
          )}
        </motion.h1>

        <p className="text-emerald-400 text-center text-sm md:text-base">
          Discover premium products at great prices
        </p>

        {/* 🔥 CATEGORY SLIDER */}
        <div className="mt-5 md:hidden relative">

          <div
            ref={sliderRef}
            onScroll={handleScroll}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar"
          >
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="w-full shrink-0 snap-center px-2"
              >
                <CategoryCard {...cat} />
              </div>
            ))}
          </div>

          {/* PAGINATION DOTS */}
          <div className="flex justify-center mt-3 gap-2">
            {categories.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === i
                    ? "bg-emerald-400 w-5"
                    : "bg-gray-500 w-2"
                }`}
              />
            ))}
          </div>

          {/* SWIPE INDICATOR */}
          <div className="absolute bottom-8 right-4 text-gray-700 text-xs animate-pulse">
            ← swipe →
          </div>

        </div>

        {/* DESKTOP GRID */}
        <div className="hidden md:grid grid-cols-4 gap-4 w-4/5 mx-auto mt-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.name} {...cat} />
          ))}
        </div>

        <Feature />
      </div>

      <FeaturedProduct />

      <Sort
        setSortOption={setSortOption}
        setCategory={setCategory}
        products={products}
      />

      {/* PRODUCTS */}
      <div className="w-[95%] mx-auto mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">

        {loading &&
          Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}

        {!loading && filteredProducts.length === 0 && (
          <p className="col-span-full text-center text-gray-300 py-10">
            No products found
          </p>
        )}

        {!loading &&
          filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
      </div>

      <Footer />
    </div>
  );
};

export default Home;