import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import cartStore from "../store/cartStore";
import userStore from "../store/userStore";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { user } = userStore();
  const { addToCart } = cartStore();
  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState(null);
  const [adding, setAdding] = useState(false);

  // Reset size when product changes
  useEffect(() => {
    setSelectedSize(null);
  }, [product?._id]);

  // ================= SAFE GUARD =================
  if (!product || typeof product !== "object") return null;

  // ================= SAFE VALUES =================
  const price = Number(product?.price ?? 0);
  const discount = Number(product?.discountPercentage ?? 0);

  const hasDiscount = discount > 0;

  const discountedPrice = hasDiscount
    ? price - (price * discount) / 100
    : price;

  // ================= ADD TO CART =================
  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (!user) {
      toast.error("Login to add products to cart", {
        id: "login-to-add",
      });
      return;
    }

    if (
      Array.isArray(product?.sizes) &&
      product.sizes.length > 0 &&
      !selectedSize
    ) {
      toast.error("Please select a size", {
        id: "select-size",
      });
      return;
    }

    try {
      setAdding(true);

      await addToCart(product, selectedSize || null);

      toast.success(
        `${product?.name || "Product"} added to cart`,
        { id: "add-to-cart-success" }
      );
    } catch (err) {
      console.error("Add to cart error:", err);

      toast.error("Failed to add to cart", {
        id: "add-cart-error",
      });
    } finally {
      setAdding(false);
    }
  };

  // ================= NAVIGATION =================
  const goToProduct = () => {
    if (!product?._id) return;
    navigate(`/products/${product._id}`);
  };

  return (
    <div
      onClick={goToProduct}
      className="group bg-slate-100 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer flex flex-col"
    >
      {/* IMAGE */}
      <div className="relative overflow-hidden">
        <img
          loading="lazy"
          src={
            product?.image?.replace(
              "/upload/",
              "/upload/w_400,q_auto,f_auto/"
            ) || "/fallback.png"
          }
          alt={product?.name || "product"}
          className="h-44 w-full object-cover group-hover:scale-105 transition"
          onError={(e) => {
            e.target.src = "/fallback.png";
          }}
        />

        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
            -{discount}%
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <h3 className="text-slate-700 font-semibold text-sm line-clamp-1">
          {product?.name || "Unnamed product"}
        </h3>

        <p className="text-gray-400 text-xs">
          {product?.category || "Uncategorized"}
        </p>

        {/* PRICE */}
        <div className="flex gap-2 items-center">
          <span className="text-indigo-400 font-semibold">
            GHC{discountedPrice.toFixed(2)}
          </span>

          {hasDiscount && (
            <span className="text-gray-500 line-through text-xs">
              GHC{price.toFixed(2)}
            </span>
          )}
        </div>

        {/* SIZES */}
        {Array.isArray(product?.sizes) &&
          product.sizes.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((size, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(size);
                  }}
                  className={`px-2 py-1 text-xs rounded border transition ${
                    selectedSize === size
                      ? "bg-indigo-500 border-indigo-500 text-white"
                      : "border-gray-600 text-gray-300 hover:border-gray-400"
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
          disabled={
            adding ||
            (Array.isArray(product?.sizes) &&
              product.sizes.length > 0 &&
              !selectedSize)
          }
          className={`mt-auto py-2 rounded text-sm font-medium transition ${
            adding ||
            (Array.isArray(product?.sizes) &&
              product.sizes.length > 0 &&
              !selectedSize)
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-indigo-500 hover:bg-indigo-400 text-white"
          }`}
        >
          {adding ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;