import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import useProductStore from "../store/productStore";

const FeaturedProducts = () => {
  const { getFeaturedProducts, products, loading } = useProductStore();

  useEffect(() => {
    getFeaturedProducts();
  }, [getFeaturedProducts]);

  // SAFE NORMALIZATION
  const safeProducts = useMemo(() => {
    if (Array.isArray(products)) return products;
    if (Array.isArray(products?.products)) return products.products;
    if (Array.isArray(products?.data)) return products.data;
    return [];
  }, [products]);

  // LOADING
  if (loading) {
    return (
      <section className="w-full py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="h-7 w-48 rounded bg-white/5 animate-pulse mb-3"></div>
              <div className="h-4 w-64 rounded bg-white/5 animate-pulse"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="
                  h-[75]
                  rounded-3xl
                  bg-[#111827]
                  border border-white/5
                  animate-pulse
                "
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-14 overflow-hidden">

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">

          <div>
            <p className="text-emerald-400 text-center text-sm font-medium mb-2 tracking-wide uppercase">
              Featured Collection
            </p>

            <h2
              className="
                text-2xl sm:text-3xl
                font-medium
                text-white
                tracking-tight
                text-center 
              "
            >
              Trending Products
            </h2>
          </div>

        </div>

        {/* EMPTY STATE */}
        {safeProducts.length === 0 ? (
          <div
            className="
              rounded-3xl
              py-10
              text-center
            "
          >
            <p className="text-gray-400 text-md">
              No featured products found
            </p>
          </div>
        ) : (
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={24}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 },
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            navigation
            loop={safeProducts.length > 5}
            className="
              featured-swiper
              overflow-visible!
            "
          >
            {safeProducts.map((product) => {
              if (!product?._id) return null;

              const imageUrl =
                product?.image?.replace(
                  "/upload/",
                  "/upload/w_600,q_auto,f_auto/"
                ) || "/fallback.png";

              const price = Number(product?.price ?? 0);

              return (
                <SwiperSlide key={product._id}>
                  <Link
                    to={`/products/${product._id}`}
                    className="
                      group
                      block
                    "
                  >
                    <div
                      className="
                        relative
                        overflow-hidden
                        rounded-3xl
                        bg-[#111827]
                        border border-white/5
                        transition-all duration-500
                        hover:border-emerald-500/20
                        hover:-translate-y-2
                        hover:shadow-2xl
                        hover:shadow-emerald-500/10
                      "
                    >

                      {/* IMAGE */}
                      <div className="overflow-hidden">
                        <img
                          loading="lazy"
                          src={imageUrl}
                          alt={product?.name || "product"}
                          onError={(e) => {
                            e.target.src = "/fallback.png";
                          }}
                          className="
                            h-64
                            w-full
                            object-cover
                            transition-transform duration-700
                            group-hover:scale-110
                          "
                        />
                      </div>

                      {/* CONTENT */}
                      <div className="p-5">

                        <h3
                          className="
                            text-white
                            font-semibold
                            text-sm sm:text-base
                            line-clamp-1
                          "
                        >
                          {product?.name || "Unnamed Product"}
                        </h3>

                        <div className="mt-3 flex items-center justify-between">

                          <p
                            className="
                              text-emerald-400
                              font-bold
                              text-lg
                            "
                          >
                            GHC {price.toFixed(2)}
                          </p>

                          <div
                            className="
                              px-3 py-1
                              rounded-full
                              bg-white/5
                              text-xs
                              text-gray-300
                              border border-white/5
                            "
                          >
                            Shop Now
                          </div>

                        </div>
                      </div>

                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>

      {/* SWIPER CUSTOM STYLE */}
      <style jsx>{`
        .featured-swiper .swiper-button-next,
        .featured-swiper .swiper-button-prev {
          width: 42px;
          height: 42px;
          border-radius: 9999px;
          background: rgba(17, 24, 39, 0.9);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(10px);
          color: white;
        }

        .featured-swiper .swiper-button-next:after,
        .featured-swiper .swiper-button-prev:after {
          font-size: 14px;
          font-weight: bold;
        }

        .featured-swiper .swiper-button-next:hover,
        .featured-swiper .swiper-button-prev:hover {
          background: rgba(16, 185, 129, 0.2);
          border-color: rgba(16, 185, 129, 0.3);
        }

        .featured-swiper .swiper-button-disabled {
          opacity: 0.3;
        }
      `}</style>
    </section>
  );
};

export default FeaturedProducts;