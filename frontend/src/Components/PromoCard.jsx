import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  TicketPercent,
  CheckCircle2,
  Trash,
  Sparkles,
} from "lucide-react";

import cartStore from "../store/cartStore";
import toast from "react-hot-toast";

const PromoCard = () => {
  const [inputCode, setInputCode] = useState("");

  const { coupon, applyCoupon, removeCoupon } = cartStore();

  const handleApplyCoupon = async () => {
    if (!inputCode.trim()) {
      toast.error("Please enter a coupon code", {
        id: "empty-code",
      });

      return;
    }

    await applyCoupon(inputCode.trim());

    setInputCode("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="
        sticky top-5
        overflow-hidden
        rounded-4xl
        border border-white/10
        bg-slate-900/90
        backdrop-blur-xl
        shadow-[0_10px_50px_rgba(0,0,0,0.45)]
      "
    >
      {/* TOP GLOW */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-20 right-0 w-52 h-52 bg-indigo-500/10 blur-[90px] rounded-full" />
      </div>

      {/* HEADER */}
      <div className="border-b border-white/10 p-5">
        <div className="flex items-center gap-3">
          <div
            className="
              w-12 h-12
              rounded-2xl
              bg-indigo-500/15
              border border-indigo-500/20
              flex items-center justify-center
              text-indigo-400
            "
          >
            <TicketPercent size={24} />
          </div>

          <div>
            <h2 className="text-white text-lg font-bold">
              Promo Code
            </h2>

            <p className="text-sm text-slate-400">
              Apply your voucher or gift card
            </p>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="p-5 space-y-4">

        {/* INPUT */}
        <div className="space-y-2">
          <label className="text-sm text-slate-300 font-medium">
            Coupon Code
          </label>

          <input
            type="text"
            value={inputCode}
            onChange={(e) =>
              setInputCode(e.target.value.toUpperCase())
            }
            placeholder="ENTER CODE"
            className="
              w-full
              rounded-2xl
              border border-white/10
              bg-slate-950/80
              px-4 py-3
              text-white
              placeholder:text-slate-500
              outline-none
              transition-all
              focus:border-indigo-500/40
              focus:ring-4 focus:ring-indigo-500/10
            "
          />
        </div>

        {/* APPLY BUTTON */}
        <button
          onClick={handleApplyCoupon}
          className="
            group
            relative
            overflow-hidden
            w-full
            rounded-2xl
            bg-indigo-500
            hover:bg-indigo-400
            py-3
            font-semibold
            text-white
            transition-all duration-200
            shadow-lg shadow-indigo-500/20
            hover:shadow-indigo-500/40
            hover:-translate-y-0.5
          "
        >
          <span className="flex items-center justify-center gap-2">
            <Sparkles size={18} />
            Apply Coupon
          </span>
        </button>

        {/* ACTIVE COUPON */}
        {coupon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="
              rounded-2xl
              border border-indigo-500/20
              bg-indigo-500/10
              p-4
              space-y-3
            "
          >
            {/* INFO */}
            <div className="flex items-start gap-3">

              <div
                className="
                  mt-0.5
                  text-indigo-400
                "
              >
                <CheckCircle2 size={22} />
              </div>

              <div className="flex-1">
                <p className="text-white font-semibold">
                  Coupon Applied
                </p>

                <p className="text-sm text-indigo-300 mt-1">
                  {coupon.code}
                </p>

                <p className="text-xs text-slate-300 mt-1">
                  You saved{" "}
                  <span className="font-semibold text-white">
                    {coupon.discountPercentage}%
                  </span>{" "}
                  on your order
                </p>
              </div>

            </div>

            {/* REMOVE BUTTON */}
            <button
              onClick={removeCoupon}
              className="
                w-full
                rounded-2xl
                border border-red-500/50
                bg-red-500/80
                hover:bg-red-500/70
                py-3
                text-sm
                font-medium
                text-red-300
                transition-all
              "
            >
              <span className="flex items-center justify-center gap-2">
                <Trash size={16} />
                Remove Coupon
              </span>
            </button>
          </motion.div>
        )}

      </div>
    </motion.div>
  );
};

export default PromoCard;