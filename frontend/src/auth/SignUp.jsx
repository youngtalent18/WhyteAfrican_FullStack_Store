import React, { useState } from "react";
import { Eye, EyeOff, Loader, UserPlus } from "lucide-react";
import userStore from "../store/userStore";

const SignUp = ({ setView, setModalOpen }) => {
  const [err, setErr] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: new URLSearchParams(window.location.search).get("ref") || "",
  });

  const { loading, register } = userStore();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErr("");

    if (!formData.name || !formData.email || !formData.password) {
      setErr("All fields are required");
      return;
    }

    if (formData.password.length < 6) {
      setErr("Password must be at least 6 characters");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(formData.email)) {
      setErr("Enter a valid email address");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErr("Passwords do not match");
      return;
    }

    try {
      const res = await register(formData);

      if (res) {
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          referralCode: "",
        });

        setTimeout(() => {
          setView("login");
          setModalOpen(false);
        }, 800);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Registration failed";

      setErr(message);
    }
  };

  return (
    <div className="bg-slate-100 text-gray-900 rounded-lg shadow-sm p-4 w-full max-w-md mx-auto">

      <h3 className="text-2xl font-bold text-center mb-3">
        Sign Up
      </h3>

      {err && (
        <div className="bg-red-200 text-red-600 px-3 py-2 rounded-md text-sm mb-3">
          {err}
        </div>
      )}

      <form className="space-y-3" onSubmit={handleRegister}>

        {/* NAME */}
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            placeholder="eg: John Doe"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={formData.name}
            onChange={(e) => {
              setErr("");
              setFormData((prev) => ({
                ...prev,
                name: e.target.value,
              }));
            }}
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            placeholder="eg: johndoe2@gmail.com"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={formData.email}
            onChange={(e) => {
              setErr("");
              setFormData((prev) => ({
                ...prev,
                email: e.target.value,
              }));
            }}
          />
        </div>

        {/* REFERRAL CODE */}
        <div>
          <label className="block text-sm font-medium">Referral Code</label>
          <input
            type="text"
            placeholder="Optional"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={formData.referralCode}
            onChange={(e) => {
              setErr("");
              setFormData((prev) => ({
                ...prev,
                referralCode: e.target.value.toUpperCase().replace(/\s+/g, ""),
              }));
            }}
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label className="block text-sm font-medium">Password</label>
          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create password"
              className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={formData.password}
              onChange={(e) => {
                setErr("");
                setFormData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }));
              }}
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

        {/* CONFIRM PASSWORD */}
        <div>
          <label className="block text-sm font-medium">
            Confirm Password
          </label>
          <div className="relative mt-1">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={formData.confirmPassword}
              onChange={(e) => {
                setErr("");
                setFormData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }));
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((current) => !current)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-indigo-500"
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* BUTTON */}
        <button
          disabled={loading}
          className={`w-full py-2 rounded-md text-white transition ${
            loading
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-1">
              <Loader size={17} className="animate-spin" />
              signing up...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1">
              <UserPlus size={17} />
              Sign Up
            </div>
          )}
        </button>

        {/* SWITCH */}
        <p className="text-center text-sm mt-2">
          Already have an account?{" "}
          <span
            className="text-indigo-500 underline cursor-pointer"
            onClick={() => setView("login")}
          >
            Login
          </span>
        </p>

      </form>
    </div>
  );
};

export default SignUp;
