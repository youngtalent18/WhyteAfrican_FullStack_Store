import { motion } from "framer-motion";
import Feature from "../Components/Feature";
import Sort from "../Components/Sort";
import useProductStore from "../store/productStore";
import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import userStore from "../store/userStore";
import Footer from "../Components/Footer";
import ProductSkeleton from "../Components/ProductSkeleton";
import ProductCard from "../Components/ProductCard";
import FeaturedProduct from "../Components/FeaturedProducts";
import CategoryCard from "../Components/CategoryCard";
import FloatingContact from "../Components/ContactUs.jsx";

const INITIAL_PRODUCT_COUNT = 8;
const PRODUCT_BATCH_SIZE = 8;
const MotionDiv = motion.div;

const Home = ({ search }) => {
  const { products, fetchAllProducts, loading } = useProductStore();
  const { user } = userStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  const [category, setCategory] = useState("All");
  const [sortOption, setSortOption] = useState("");
  const [productScroll, setProductScroll] = useState({
    key: "",
    count: INITIAL_PRODUCT_COUNT,
  });
  const loadMoreRef = useRef(null);

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
        if (sortOption === "name") return a.name.localeCompare(b.name);
        return 0;
      });
  }, [products, search, category, sortOption]);

  const productFilterKey = `${search || ""}-${category}-${sortOption}`;
  const visibleCount =
    productScroll.key === productFilterKey
      ? productScroll.count
      : INITIAL_PRODUCT_COUNT;
  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMoreProducts = visibleCount < filteredProducts.length;

  const loadMoreProducts = useCallback(() => {
    setProductScroll((current) => {
      const currentCount =
        current.key === productFilterKey ? current.count : INITIAL_PRODUCT_COUNT;

      return {
        key: productFilterKey,
        count: Math.min(
          currentCount + PRODUCT_BATCH_SIZE,
          filteredProducts.length
        ),
      };
    });
  }, [filteredProducts.length, productFilterKey]);

  const handleCategoryChange = (nextCategory) => {
    setCategory(nextCategory);
    setProductScroll({
      key: `${search || ""}-${nextCategory}-${sortOption}`,
      count: INITIAL_PRODUCT_COUNT,
    });
  };

  const handleSortChange = (nextSortOption) => {
    setSortOption(nextSortOption);
    setProductScroll({
      key: `${search || ""}-${category}-${nextSortOption}`,
      count: INITIAL_PRODUCT_COUNT,
    });
  };

  useEffect(() => {
    const currentRef = loadMoreRef.current;

    if (!currentRef || !hasMoreProducts) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        loadMoreProducts();
      },
      { rootMargin: "260px 0px" }
    );

    observer.observe(currentRef);

    return () => observer.disconnect();
  }, [hasMoreProducts, loadMoreProducts, productFilterKey, visibleCount]);

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
      <div className=" px-3 py-4">

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm md:text-2xl font-bold text-center"
        >
          {user ? (
            <>
              Hi{" "}
              <span className="text-indigo-500 font-extrabold underline">
                {user.name}
              </span>
              , Explore Our Categories
            </>
          ) : (
            "Welcome to WhyteAfrican Shop"
          )}
        </motion.h1>

        <p className="text-indigo-400 text-center text-sm md:text-base">
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
                    ? "bg-indigo-500 w-5"
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
            <CategoryCard key={cat.id} {...cat} />
          ))}
        </div>

        <Feature />
      </div>

      <FeaturedProduct />

      <Sort
        setSortOption={handleSortChange}
        setCategory={handleCategoryChange}
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
          visibleProducts.map((product, index) => (
            <MotionDiv
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{
                duration: 0.3,
                delay: Math.min(index * 0.025, 0.16),
              }}
            >
              <ProductCard product={product} />
            </MotionDiv>
          ))}
      </div>

      {!loading && filteredProducts.length > 0 && (
        <div
          ref={loadMoreRef}
          className="mx-auto mt-5 flex min-h-12 w-[95%] items-center justify-center rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-400"
        >
          {hasMoreProducts ? (
            <button
              type="button"
              onClick={loadMoreProducts}
              className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-indigo-200 transition hover:bg-indigo-500/20"
            >
              Load more products
            </button>
          ) : (
            <span>
              Showing {visibleProducts.length} of {filteredProducts.length} products
            </span>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Home;
