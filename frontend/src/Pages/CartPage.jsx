import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useMemo } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

import CartItem from "../Components/CartItem.jsx";
import cartStore from "../store/cartStore.js";
import userStore from "../store/userStore.js";
import OrderSummary from "../Components/OrderSummary.jsx";
import PromoCard from "../Components/PromoCard.jsx";

const CartPage = () => {
  const { cart, getCartItems } = cartStore();
  const { user } = userStore();

  useEffect(() => {
    getCartItems();
  }, [getCartItems]);

  const safeCart = useMemo(() => {
    if (Array.isArray(cart)) return cart;
    if (Array.isArray(cart?.cart)) return cart.cart;
    if (Array.isArray(cart?.items)) return cart.items;
    return [];
  }, [cart]);

  return (
    <div className="min-h-screen bg-[#06090fef] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* HEADER */}
        {cart.length > 0? (
          <div className="mb-6">
            <h1 className="text-xl font-semibold tracking-tight">
              Shopping Cart
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Review your items and proceed to checkout
            </p>
          </div>
        ):(
          null
        )}

        {/* EMPTY STATE */}
        {safeCart.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center rounded-2xl p-10 sm:p-14 min-h-[55vh]">

            <div className="bg-slate-800 p-4 rounded-full mb-5">
              <ShoppingCart className="w-10 h-10 text-slate-400" />
            </div>

            <h2 className="text-lg sm:text-xl font-medium text-white">
              {user?.name
                ? `${user.name}, your cart is empty`
                : "Your cart is empty"}
            </h2>

            <p className="text-sm text-slate-400 mt-2 max-w-md">
              Oops! It looks like you haven't added any items to your cart yet. 
            </p>

            <Link
              to="/"
              className="
                mt-6
                bg-indigo-500 hover:bg-indigo-500
                transition
                px-6 py-2
                rounded-md
                font-medium
              "
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ITEMS */}
            <motion.div
              className="lg:col-span-2 space-y-4"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {safeCart.map((item, index) => {
                if (!item?.productId) return null;

                return (
                  <CartItem
                    key={`${item.productId}-${item.size || index}`}
                    item={item}
                  />
                );
              })}
            </motion.div>

            {/* SUMMARY */}
            <motion.div
              className="space-y-4 lg:sticky lg:top-24"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <OrderSummary />
              <PromoCard />
            </motion.div>

          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;