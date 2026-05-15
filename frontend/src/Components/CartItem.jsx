import React from "react";
import cartStore from "../store/cartStore";
import { Trash2 } from "lucide-react";

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = cartStore();

  return (
    <div
      className="
        group
        bg-[#111827]
        border border-white/5
        rounded-3xl
        p-4 sm:p-5
        transition-all duration-300
        hover:border-emerald-500/20
        hover:shadow-2xl
        hover:shadow-emerald-500/5
      "
    >
      <div className="flex flex-col sm:flex-row gap-5 sm:items-center">

        {/* IMAGE */}
        <div className="overflow-hidden rounded-2xl bg-black/20">
          <img
            src={
              item.image
                ? item.image.replace(
                    "/upload/",
                    "/upload/w_500,q_auto,f_auto/"
                  )
                : "/fallback.png"
            }
            alt={item.name || "Product"}
            className="
              w-full sm:w-28
              h-48 sm:h-28
              object-cover
              transition-transform duration-500
              group-hover:scale-105
            "
          />
        </div>

        {/* INFO */}
        <div className="flex-1 min-w-0">

          <h3
            className="
              text-white
              font-semibold
              text-base sm:text-lg
              truncate
            "
          >
            {item.name}
          </h3>

          <p className="text-sm text-gray-400 mt-1 capitalize">
            {item.category}
          </p>

          {item.size && (
            <div
              className="
                inline-flex
                items-center
                mt-3
                px-3 py-1
                rounded-full
                bg-indigo-500/10
                border border-indigo-500/20
                text-indigo-500-300
                text-xs
                font-medium
              "
            >
              Size: {item.size}
            </div>
          )}

          <div className="mt-4">
            <p className="text-indigo-500 font-bold text-lg">
              GHC {Number(item.price).toFixed(2)}
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div
          className="
            flex
            sm:flex-col
            items-center
            justify-between
            gap-4
          "
        >

          {/* QUANTITY */}
          <div
            className="
              flex items-center
              bg-black/30
              border border-white/5
              rounded-2xl
              overflow-hidden
            "
          >
            <button
              onClick={() =>
                updateQuantity(
                  item.productId,
                  item.size,
                  item.quantity - 1
                )
              }
              className="
                w-10 h-10
                text-gray-300
                hover:bg-white/5
                transition
              "
            >
              −
            </button>

            <span
              className="
                w-10 text-center
                text-white font-medium
              "
            >
              {item.quantity}
            </span>

            <button
              onClick={() =>
                updateQuantity(
                  item.productId,
                  item.size,
                  item.quantity + 1
                )
              }
              className="
                w-10 h-10
                text-gray-300
                hover:bg-white/5
                transition
              "
            >
              +
            </button>
          </div>

          {/* REMOVE */}
          <button
            onClick={() =>
              removeFromCart(item.productId, item.size)
            }
            className="
              w-10 h-10
              rounded-2xl
              flex items-center justify-center
              bg-red-500/50
              border border-red-500/30
              text-red-400
              hover:bg-red-500/50
              transition-all duration-200
            "
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;