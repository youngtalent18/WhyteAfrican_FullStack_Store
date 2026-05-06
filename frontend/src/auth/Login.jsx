import { Loader, LogInIcon } from "lucide-react";
import userStore from "../store/userStore";
import { useState, useEffect } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const Login = ({ setView, setModalOpen }) => {
  const { loading, signIn } = userStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showResend, setShowResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // ⏳ Countdown logic
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  // 🔐 LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signIn(formData);

      setModalOpen(false);
      setShowResend(false);
    } catch (error) {
      const status = error?.response?.status;

      if (status === 403) {
        setShowResend(true);
      }
    }
  };

  // 📧 RESEND VERIFICATION
  const handleResend = async () => {
    try {
      setResendLoading(true);

      const res = await api.post("/auth/resend-verification", {
        email: formData.email,
      });

      toast.success(res.data.message || "Verification email sent", {id: "resend-success"});

      // 🔥 Start countdown immediately
      setCooldown(res.data.retryAfter || 60);

    } catch (err) {
      if (err.response?.status === 429) {
        const seconds = err.response.data.retryAfter;
        setCooldown(seconds);
      }

      toast.error(
        err.response?.data?.message || "Failed to resend email", {id: "resend-error"}
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-slate-100 text-gray-900 rounded-xl shadow-lg p-5 sm:p-6">

      {/* HEADER */}
      <h3 className="text-xl sm:text-2xl font-bold text-center">
        Welcome Back
      </h3>
      <p className="text-xs sm:text-sm text-gray-500 text-center mt-1">
        Login to continue shopping
      </p>

      <form onSubmit={handleLogin} className="mt-5 space-y-4">

        {/* EMAIL */}
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="you@example.com"
          />
        </div>

        {/* PASSWORD */}
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">
              Password
            </label>

            <p
              onClick={() => setView("forgot")}
              className="text-emerald-600 text-xs sm:text-sm cursor-pointer hover:underline"
            >
              Forgot password?
            </p>
          </div>

          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
            className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="••••••••"
          />
        </div>

        {/* LOGIN BUTTON */}
        <button
          disabled={loading}
          className={`w-full py-2.5 rounded-md text-white font-medium transition
            ${
              loading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-600"
            }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2 text-sm">
              <Loader size={16} className="animate-spin" />
              Logging in...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2 text-sm">
              <LogInIcon size={16} />
              Login
            </span>
          )}
        </button>

        {/* RESEND VERIFICATION */}
        {showResend && (
          <div className="text-center space-y-2 pt-2">

            <p className="text-xs sm:text-sm text-red-500">
              Please verify your email to continue
            </p>

            <button
              type="button"
              onClick={handleResend}
              disabled={resendLoading || cooldown > 0}
              className={`text-xs sm:text-sm font-medium
                ${
                  cooldown > 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-600 hover:underline"
                }`}
            >
              {resendLoading ? (
                <span className="flex items-center justify-center gap-1">
                  <Loader size={14} className="animate-spin" />
                  Sending...
                </span>
              ) : cooldown > 0 ? (
                `Resend in ${cooldown}s`
              ) : (
                "Resend verification email"
              )}
            </button>
          </div>
        )}

        {/* SWITCH */}
        <p className="text-center text-xs sm:text-sm mt-2">
          Don’t have an account?{" "}
          <span
            className="text-blue-500 underline cursor-pointer"
            onClick={() => setView("signup")}
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;