import React from "react";
import cartStore from "../store/cartStore";
import { Trash2 } from "lucide-react";

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = cartStore();

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 sm:p-4 hover:shadow-lg transition">

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">

        {/* IMAGE */}
        <img
          src={
            item.image
              ? item.image.replace("/upload/", "/upload/w_300,q_auto,f_auto/")
              : "/fallback.png"
          }
          alt={item.name || "Product"}
          className="w-full sm:w-24 h-40 sm:h-24 object-cover rounded-md"
        />

        {/* INFO */}
        <div className="flex-1 space-y-1">

          <h3 className="text-white font-medium text-sm sm:text-base line-clamp-1">
            {item.name}
          </h3>

          <p className="text-xs sm:text-sm text-gray-400">
            {item.category}
          </p>

          {item.size && (
            <p className="text-xs text-emerald-400">
              Size: {item.size}
            </p>
          )}

          <p className="text-emerald-400 font-semibold text-sm sm:text-base">
            GHC {item.price}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-between gap-3">

          {/* QTY */}
          <div className="flex items-center gap-2 bg-slate-700 px-2 py-1 rounded-md">

            <button
              onClick={() =>
                updateQuantity(item.productId, item.size, item.quantity - 1)
              }
              className="w-7 h-7 flex items-center justify-center rounded bg-slate-600 hover:bg-slate-500 text-white text-sm"
            >
              -
            </button>

            <span className="text-white text-sm w-6 text-center">
              {item.quantity}
            </span>

            <button
              onClick={() =>
                updateQuantity(item.productId, item.size, item.quantity + 1)
              }
              className="w-7 h-7 flex items-center justify-center rounded bg-slate-600 hover:bg-slate-500 text-white text-sm"
            >
              +
            </button>

          </div>

          {/* REMOVE */}
          <button
            onClick={() => removeFromCart(item.productId, item.size)}
            className="w-8 h-8 flex items-center justify-center rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
          >
            <Trash2 size={16} />
          </button>

        </div>

      </div>
    </div>
  );
};

export default CartItem;