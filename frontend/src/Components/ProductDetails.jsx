import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import cartStore from "../store/cartStore";
import toast from "react-hot-toast";
import BackButton from "./BackButton";
import PeopleAlsoBought from "./PeopleAlsoBought";
import userStore from "../store/userStore";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = cartStore();
  const { user } = userStore();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH PRODUCT =================
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Optional: auto-select first size (kept, but now consistent)
  useEffect(() => {
    if (product?.sizes?.length) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  // ================= LOADING =================
  if (loading) {
    return <div className="p-6 text-white animate-pulse">Loading product...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-400">{error}</div>;
  }

  if (!product) {
    return <div className="p-6 text-gray-400">Product not found</div>;
  }

  // ================= SAFE PRICING =================
  const price = Number(product?.price || 0);
  const discount = Number(product?.discountPercentage || 0);

  const hasDiscount = discount > 0;

  const discountedPrice = hasDiscount
    ? price - (price * discount) / 100
    : price;

  // ================= ADD TO CART =================
  const handleAddToCart = () => {
    if (!user) {
      toast.error("Login to add products to cart", {
        id: "login-error",
      });
      return;
    }

    const sizeToUse = selectedSize || product.sizes?.[0] || null;

    addToCart(product, sizeToUse);

    toast.success(`${product.name} added to cart`, {
      id: "add-to-cart-success",
    });
  };

  const hasSizes = Array.isArray(product?.sizes) && product.sizes.length > 0;

  return (
    <div className="max-w-6xl mx-auto p-6 text-white">

      {/* BACK BUTTON */}
      <div className="mb-4">
        <BackButton />
      </div>

      <div className="grid md:grid-cols-2 gap-10">

        {/* IMAGE */}
        <div className="relative bg-slate-800 p-4 rounded-xl">
          <img
            loading="lazy"
            src={
              product.image
                ? product.image.replace(
                    "/upload/",
                    "/upload/w_500,q_auto,f_auto/"
                  )
                : "/fallback.png"
            }
            alt={product.name}
            className="w-full h-80 object-cover rounded-lg"
          />

          {hasDiscount && (
            <span className="absolute top-3 left-3 bg-red-600 px-2 py-1 text-sm rounded">
              -{discount}%
            </span>
          )}
        </div>

        {/* DETAILS */}
        <div className="flex flex-col gap-6">

          {/* TITLE + PRICE */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-medium mb-1">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-indigo-400 text-xl sm:text-2xl font-semibold">
                GHC {discountedPrice.toFixed(2)}
              </span>

              {hasDiscount && (
                <span className="text-gray-400 line-through">
                  GHC {price.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-gray-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* SIZES */}
          {hasSizes && (
            <div>
              <p className="text-sm text-gray-400 mb-1">
                Select Size
              </p>

              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded border text-sm transition
                      ${
                        selectedSize === size
                          ? "bg-indigo-600 border-indigo-500 text-white"
                          : "border-gray-600 text-gray-300 hover:border-indigo-500"
                      }
                    `}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {selectedSize && (
                <p className="text-xs text-indigo-400 mt-2">
                  Selected: {selectedSize}
                </p>
              )}
            </div>
          )}

          {/* ADD TO CART */}
          <button
            onClick={handleAddToCart}
            className="py-3 rounded-lg font-semibold bg-indigo-600 hover:bg-indigo-500 transition active:scale-[0.98]"
          >
            Add to Cart
          </button>

        </div>
      </div>

      {/* RECOMMENDATIONS */}
      <PeopleAlsoBought />
    </div>
  );
};

export default ProductDetails;