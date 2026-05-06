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

  // ================= SAFE CART NORMALIZATION =================
  const safeCart = useMemo(() => {
    if (Array.isArray(cart)) return cart;
    if (Array.isArray(cart?.cart)) return cart.cart;
    if (Array.isArray(cart?.items)) return cart.items;
    return [];
  }, [cart]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">

        {/* HEADER */}
        <div className="mb-5">
          <h1 className="text-2xl font-semibold">Shopping Cart</h1>
          <p className="text-sm text-gray-400">
            Review your items before checkout
          </p>
        </div>

        {/* EMPTY STATE */}
        {safeCart.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center bg-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-12 min-h-[55vh]">

            <ShoppingCart className="w-16 h-16 text-gray-500 mb-4" />

            <h2 className="text-lg sm:text-xl font-medium text-gray-200">
              {user?.name
                ? `${user.name}, your cart is empty`
                : "Your cart is empty"}
            </h2>

            <p className="text-sm text-gray-400 mt-2 max-w-md">
              Add products you love — they’ll appear here for checkout.
            </p>

            <Link
              to="/"
              className="mt-6 bg-emerald-500 hover:bg-emerald-600 transition px-6 py-2 rounded-lg font-medium"
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
              className="space-y-4"
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