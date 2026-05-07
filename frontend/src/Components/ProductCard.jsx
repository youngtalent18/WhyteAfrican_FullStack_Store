import React, { useState } from "react";
import { toast } from "react-hot-toast";
import cartStore from "../store/cartStore";
import userStore from "../store/userStore";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { user } = userStore();
  const { addToCart } = cartStore();
  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState(null);

  if (!product || typeof product !== "object") return null;

  const price = Number(product?.price || 0);
  const discount = Number(product?.discountPercentage || 0);

  const hasDiscount = discount > 0;
  const discountedPrice = hasDiscount
    ? price - (price * discount) / 100
    : price;

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (!user) {
      toast.error("Login to add products to cart");
      return;
    }

    if (product?.sizes?.length && !selectedSize) {
      toast.error("Select a size first");
      return;
    }

    try {
      await addToCart(product, selectedSize || null);
      toast.success(`${product?.name || "Product"} added`);
    } catch (err) {
      toast.error("Failed to add to cart",{id: "failed"});
      console.log("Error",err);
    }
  };

  const goToProduct = () => {
    if (!product?._id) return;
    navigate(`/products/${product._id}`);
  };

  return (
    <div
      onClick={goToProduct}
      className="group bg-[#111A2E] border border-[#1E293B] rounded-2xl overflow-hidden 
                 hover:shadow-xl hover:shadow-black/20 hover:scale-[1.02] 
                 transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* IMAGE */}
      <div className="relative overflow-hidden">
        <img
          loading="lazy"
          src={
            product?.image?.replace(
              "/upload/",
              "/upload/w_500,q_auto,f_auto/"
            ) || "/fallback.png"
          }
          alt={product?.name || "product"}
          className="h-48 w-full object-cover group-hover:scale-110 transition duration-500"
          onError={(e) => (e.target.src = "/fallback.png")}
        />

        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow">
            -{discount}%
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        
        {/* TITLE */}
        <h3 className="text-white font-semibold text-sm line-clamp-1">
          {product?.name || "Unnamed product"}
        </h3>

        {/* CATEGORY */}
        <p className="text-[#94A3B8] text-xs">
          {product?.category || "Uncategorized"}
        </p>

        {/* PRICE */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[#22C55E] font-bold text-base">
            GHC {discountedPrice.toFixed(2)}
          </span>

          {hasDiscount && (
            <span className="text-gray-500 line-through text-xs">
              GHC {price.toFixed(2)}
            </span>
          )}
        </div>

        {/* SIZES */}
        {product?.sizes?.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-2">
            {product.sizes.map((size, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSize(size);
                }}
                className={`px-2.5 py-1 text-xs rounded-lg border transition ${
                  selectedSize === size
                    ? "bg-[#4F8CFF] border-[#4F8CFF] text-white"
                    : "border-[#334155] text-gray-300 hover:border-[#4F8CFF]"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        {/* BUTTON */}
        <button
          onClick={handleAddToCart}
          disabled={product?.sizes?.length > 0 && !selectedSize}
          className={`mt-auto py-2.5 rounded-lg text-sm font-semibold transition ${
            product?.sizes?.length > 0 && !selectedSize
              ? "bg-[#1E293B] text-gray-500 cursor-not-allowed"
              : "bg-[#4F8CFF] hover:opacity-90 text-white"
          }`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;