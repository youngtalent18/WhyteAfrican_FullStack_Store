import { useEffect, useState } from "react";
import api from "../api/axios";
import cartStore from "../store/cartStore";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Loader2 } from "lucide-react";

const PaymentSuccess = () => {
  const { clearCart, removeCoupon } = cartStore();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = new URLSearchParams(
        window.location.search
      ).get("reference");

      if (!reference) {
        setStatus("error");
        return;
      }

      try {
        await api.post("/payment/verify", { reference });

        clearCart();
        removeCoupon();

        setStatus("success");

        setTimeout(() => {
          navigate("/orders");
        }, 2500);
      } catch (err) {
        console.log("Payment verify error:", err);
        setStatus("error");
      }
    };

    verifyPayment();
  }, [clearCart, removeCoupon, navigate]);

  return (
    <div className="h-[70vh] flex items-center justify-center px-4">

      <div className="w-full max-w-md text-center bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">

        {/* LOADING */}
        {status === "loading" && (
          <>
            <Loader2
              className="animate-spin mx-auto text-indigo-400"
              size={42}
            />

            <h1 className="text-white text-lg font-semibold">
              Verifying payment...
            </h1>

            <p className="text-slate-400 text-sm">
              Please wait while we confirm your transaction
            </p>
          </>
        )}

        {/* SUCCESS */}
        {status === "success" && (
          <>
            <CheckCircle
              className="mx-auto text-indigo-400"
              size={48}
            />

            <h1 className="text-white text-xl font-bold">
              Payment successful 🎉
            </h1>

            <p className="text-slate-400 text-sm">
              Your order has been confirmed. Redirecting...
            </p>
          </>
        )}

        {/* ERROR */}
        {status === "error" && (
          <>
            <h1 className="text-red-400 text-lg font-semibold">
              Payment verification failed
            </h1>

            <p className="text-slate-400 text-sm">
              Something went wrong. Please try again.
            </p>

            <button
              onClick={() => navigate("/cart")}
              className="mt-3 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm"
            >
              Back to Cart
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;