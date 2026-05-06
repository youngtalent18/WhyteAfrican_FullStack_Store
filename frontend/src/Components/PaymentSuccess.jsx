import { useEffect, useState } from "react";
import api from "../api/axios";
import cartStore from "../store/cartStore";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Loader2 } from "lucide-react";

const PaymentSuccess = () => {
  const { clearCart, removeCoupon } = cartStore(); // ✅ FIXED
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const verify = async () => {
      const reference = new URLSearchParams(window.location.search).get(
        "reference"
      );

      if (!reference) {
        setStatus("error");
        return;
      }

      try {
        await api.post("/payment/verify", { reference });

        // 🔥 CRITICAL FIX
        clearCart();
        removeCoupon();

        setStatus("success");

        setTimeout(() => {
          navigate("/orders");
        }, 2500);
      } catch (err) {
        console.log(err);
        setStatus("error");
      }
    };

    verify();
  }, [clearCart, removeCoupon, navigate]); // ✅ include dependency

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md text-center bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">

        {status === "loading" && (
          <>
            <Loader2 className="animate-spin mx-auto text-emerald-400" size={40} />
            <h1 className="text-white text-lg sm:text-xl font-semibold">
              Verifying Payment...
            </h1>
            <p className="text-slate-400 text-sm">
              Please wait while we confirm your transaction
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="mx-auto text-emerald-400" size={48} />
            <h1 className="text-white text-xl sm:text-2xl font-bold">
              Payment Successful 🎉
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Your order has been confirmed. Redirecting to your orders...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-red-400 text-xl font-semibold">
              Payment Verification Failed
            </h1>
            <p className="text-slate-400 text-sm">
              Something went wrong. Please contact support or try again.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-3 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm"
            >
              Go Home
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default PaymentSuccess;