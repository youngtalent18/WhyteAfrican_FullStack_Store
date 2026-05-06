import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import useProductStore from "../store/productStore";

const FeaturedProducts = () => {
  const { getFeaturedProducts, products, loading } = useProductStore();

  useEffect(() => {
    getFeaturedProducts();
  }, [getFeaturedProducts]);

  // ================= SAFE NORMALIZATION =================
  const safeProducts = useMemo(() => {
    if (Array.isArray(products)) return products;
    if (Array.isArray(products?.products)) return products.products;
    if (Array.isArray(products?.data)) return products.data;
    return [];
  }, [products]);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-52 bg-slate-800 animate-pulse rounded-xl"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-30 w-full">
      {/* TITLE */}
      <h2 className="text-white text-center text-xl sm:text-2xl py-5 mt-5 font-bold mb-4">
        Our Featured Products
      </h2>

      {/* EMPTY STATE (IMPORTANT FIX) */}
      {safeProducts.length === 0 ? (
        <p className="text-center text-gray-400">No featured products found</p>
      ) : (
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 5 },
          }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          navigation
          pagination={{ clickable: true }}
          loop={safeProducts.length > 5} // 🔥 FIX: prevents Swiper crash
          className="pb-10 [&_.swiper-pagination]:relative! [&_.swiper-pagination]:mt-4!"
        >
          {safeProducts.map((product) => {
            if (!product?._id) return null;

            const imageUrl =
              product?.image?.replace(
                "/upload/",
                "/upload/w_300,q_auto,f_auto/"
              ) || "/fallback.png";

            const price = Number(product?.price ?? 0);

            return (
              <SwiperSlide key={product._id}>
                <Link
                  to={`/products/${product._id}`}
                  className="bg-slate-800 rounded-xl p-3 mx-2 hover:scale-[1.03] transition-all duration-200 block"
                >
                  <img
                    loading="lazy"
                    src={imageUrl}
                    alt={product?.name || "product"}
                    className="h-40 w-full object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = "/fallback.png";
                    }}
                  />

                  <h3 className="text-white mt-1 text-sm font-medium line-clamp-1">
                    {product?.name || "Unnamed product"}
                  </h3>

                  <p className="text-green-400 text-sm font-medium">
                    GHC {price.toFixed(2)}
                  </p>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </div>
  );
};

export default FeaturedProducts;