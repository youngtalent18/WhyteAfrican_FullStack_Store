import React, { useState } from "react";
import cartStore from "../store/cartStore";
import toast from "react-hot-toast";

const PromoCard = () => {
  const [inputCode, setInputCode] = useState("");

  const { coupon, applyCoupon, removeCoupon } = cartStore();

  const handleApplyCoupon = async () => {
    if (!inputCode.trim()) {
      toast.error("Please enter a coupon code", { id: "empty-code" });
      return;
    }

    await applyCoupon(inputCode);
    setInputCode(""); // clear input after apply
  };

  return (
    <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl h-fit sticky top-5 mt-4 shadow-md">

      <label className="text-gray-300 font-medium mb-2 block">
        Do you have any voucher or giftcard?
      </label>

      <input
        type="text"
        value={inputCode}
        onChange={(e) => setInputCode(e.target.value)}
        placeholder="Enter code here"
        className="w-full bg-slate-600 text-gray-100 py-2 px-2 rounded-lg border border-slate-500"
      />

      <button
        onClick={handleApplyCoupon}
        className="w-full bg-green-600 hover:bg-green-500 mt-3 text-white py-2 rounded-lg cursor-pointer"
      >
        Apply Code
      </button>

      {/* ONLY ONE STATE CHECK */}
      {coupon && (
        <div className="mt-4">
          <h3 className="text-md text-gray-300 font-medium">
            Applied Coupon
          </h3>

          <p className="mt-2 text-sm text-slate-200">
            {coupon.code} - {coupon.discountPercentage}% off
          </p>

          <button
            onClick={removeCoupon}
            className="w-full bg-red-600 hover:bg-red-500 mt-3 text-white py-2 rounded-lg cursor-pointer "
          >
            Remove Coupon
          </button>
        </div>
      )}
    </div>
  );
};

export default PromoCard;