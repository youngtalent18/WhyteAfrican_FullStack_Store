import { useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { Loader2, Mail } from "lucide-react";

const ForgotPassword = ({ setView }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Email is required", {
        id: "forgot-no-email",
      });
    }

    try {
      setLoading(true);
      await api.post("/auth/forgot-password", { email });

      toast.success("Reset link sent to your email", {
        id: "forgot-success",
      });
      setEmail("");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Something went wrong",
        { id: "forgot-error" }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-slate-100 text-gray-900 rounded-xl shadow-lg p-5 sm:p-6 space-y-5">

      {/* HEADER */}
      <div className="text-center space-y-2">
        <div className="mx-auto w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <Mail className="text-indigo-500" size={22} />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold">
          Forgot Password
        </h2>

        <p className="text-xs sm:text-sm text-gray-500">
          Enter your email and we’ll send you a reset link
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* INPUT */}
        <div className="space-y-1">
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full px-3 py-2.5 text-sm rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* BUTTON */}
        <button
          disabled={loading}
          className={`w-full py-2.5 rounded-md text-sm font-medium transition flex items-center justify-center gap-2 ${
            loading
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500 text-white"
          }`}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Sending...
            </>
          ) : (
            "Send Reset Link"
          )}
        </button>
      </form>

      {/* FOOTER */}
      <p className="text-center text-xs sm:text-sm text-gray-500">
        Remember your password?{" "}
        <span
          onClick={() => setView("login")}
          className="text-indigo-600 underline cursor-pointer"
        >
          Back to login
        </span>
      </p>
    </div>
  );
};

export default ForgotPassword;