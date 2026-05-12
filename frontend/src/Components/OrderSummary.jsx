import React, { useState, useRef } from "react";
import cartStore from "../store/cartStore";
import userStore from "../store/userStore";
import { ArrowRight, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import {toast} from "react-hot-toast";

const OrderSummary = () => {
  const { cart, subtotal, total, discount, coupon } = cartStore();
  const { user } = userStore();

  const [loading, setLoading] = useState(false);
  const isProcessing = useRef(false);

  // shipping state
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const formattedSubtotal = (subtotal || 0).toFixed(2);
  const formattedTotal = (total || 0).toFixed(2);
  const formattedSavings = (discount || 0).toFixed(2);

  const handlePayment = async () => {
    // prevent double click
    if (isProcessing.current) return;

    isProcessing.current = true;
    setLoading(true);

    try {
      // ================= VALIDATION =================
      if (!cart || cart.length === 0) {
        throw new Error("Cart is empty");
      }

      if (!user?.email) {
        throw new Error("User email missing");
      }

      if (!phone.trim() || !address.trim()) {
        throw new Error("Phone and address are required");
      }

      // ================= ITEMS =================
      const items = cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        size: item.size || null,
      }));

      // ================= PAYLOAD =================
      const payload = {
        email: user.email,
        items,
        phone,
        address,
        couponCode: coupon?.code || null,
      };

      const res = await api.post("/payment/initialize", payload);

      const url = res.data?.data?.authorization_url;

      if (!url) {
        throw new Error("Payment URL missing");
      }

      // redirect to Paystack
      window.location.href = url;
    } catch (error) {
      toast.error( error.response?.data?.message || error.message);
      console.error("Payment initialization failed:", error);
    } finally {
      isProcessing.current = false;
      setLoading(false);
    }
  };

  const isValid = cart.length > 0 && phone.trim() && address.trim();

  return (
    <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl h-fit top-5">

      {/* ================= SUMMARY ================= */}
      <h2 className="text-lg font-semibold text-white mb-4">
        Order Summary
      </h2>

      <div className="space-y-2 text-gray-300 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>GHC {formattedSubtotal}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between">
            <span>Savings</span>
            <span>-GHC {formattedSavings}</span>
          </div>
        )}

        {coupon && (
          <div className="flex justify-between">
            <span>Coupon ({coupon.code})</span>
            <span>{coupon.discountPercentage}%</span>
          </div>
        )}

        <hr className="border-slate-600 my-2" />

        <div className="flex justify-between text-white font-bold">
          <span>Total</span>
          <span>GHC {formattedTotal}</span>
        </div>
      </div>

      {/* ================= SHIPPING FORM ================= */}
      <div className="space-y-3 mt-4">

        <input
          type="tel"
          placeholder="Phone number (for delivery)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-2 rounded bg-slate-700 text-white border border-slate-600 outline-none"
        />

        <textarea
          placeholder="Delivery address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-2 rounded bg-slate-700 text-white border border-slate-600 outline-none"
        />
      </div>

      {/* ================= BUTTON ================= */}
      <button
        onClick={handlePayment}
        disabled={loading || !isValid}
        className={`w-full mt-5 py-3 rounded-lg font-semibold text-white transition
        ${
          loading || !isValid
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-500"
        }`}
      >
        {loading ? (
          <span className="flex items-center gap-2 justify-center">
            <Loader className="animate-spin" />
            Initializing...
          </span>
        ) : (
          "Make Payment"
        )}
      </button>

      {/* ================= LINK ================= */}
      <Link
        to="/"
        className="flex gap-1 items-center justify-center mt-2 text-slate-200 text-sm underline"
      >
        <ArrowRight size={18} />
        Continue shopping
      </Link>
    </div>
  );
};

export default OrderSummary;