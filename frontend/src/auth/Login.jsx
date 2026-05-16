import { Eye, EyeOff, Loader, LogInIcon } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

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

  const handleResend = async () => {
    try {
      setResendLoading(true);

      const res = await api.post("/auth/resend-verification", {
        email: formData.email,
      });

      toast.success(res.data.message || "Verification email sent", {
        id: "resend-success",
      });

      setCooldown(res.data.retryAfter || 60);
    } catch (err) {
      if (err.response?.status === 429) {
        const seconds = err.response.data.retryAfter;
        setCooldown(seconds);
      }

      toast.error(
        err.response?.data?.message || "Failed to resend email",
        { id: "resend-error" }
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
            className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
              className="text-indigo-500 text-xs sm:text-sm cursor-pointer hover:underline"
            >
              Forgot password?
            </p>
          </div>

          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              className="w-full px-3 py-2.5 pr-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-indigo-500"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* LOGIN BUTTON */}
        <button
          disabled={loading}
          className={`w-full py-2.5 rounded-md text-white font-medium transition
            ${
              loading
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500"
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
                    : "text-indigo-500 hover:underline"
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
            className="text-indigo-500 underline cursor-pointer"
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
