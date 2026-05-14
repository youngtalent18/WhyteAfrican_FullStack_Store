import { create } from "zustand";
import { toast } from "react-hot-toast";
import api from "../api/axios.js";
import cartStore from "./cartStore.js"; // 🔥 IMPORTANT

export const userStore = create((set) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  // ================= REGISTER =================
  register: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match");
    }

    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      set({ loading: false });

      toast.success(res.data.message || "Check your email to verify account");

      return res.data;
    } catch (error) {
      set({ loading: false });

      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Registration failed"
      );

      console.log("Register error:", error);
    }
  },

  // ================= LOGIN =================
  signIn: async ({ email, password }) => {
    set({ loading: true });

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      // 🔥 STEP 1: RESET OLD CART (CRITICAL)
      cartStore.getState().clearCart();

      // 🔥 STEP 2: SET USER
      set({
        user: res.data.user,
        loading: false,
      });

      // 🔥 STEP 3: LOAD USER-SPECIFIC CART
      await cartStore.getState().getCartItems();

      toast.success("Login successful", { duration: 3000 }, {id: "login-success"});

      return res.data;
    } catch (error) {
      set({ loading: false });

      toast.error(
        error.response?.data?.message || "Login failed", { duration: 3000 }, {id: "login-failed"}
      );

      console.log("Login error:", error);

      throw error;
    }
  },

  // ================= LOGOUT =================
  logout: async () => {
    try {
      await api.post("/auth/logout");

      // 🔥 STEP 1: CLEAR USER
      set({ user: null });

      // 🔥 STEP 2: CLEAR CART + COUPON
      cartStore.getState().clearCart();

      toast.success("Logged out", { duration: 3000 }, {id: "logout-success"});
    } catch (error) {
      console.log("Logout error:", error);

      toast.error(
        error.response?.data?.message || "Logout failed", { duration: 3000 }, {id: "logout-failed"}
      );
    }
  },

  // ================= CHECK AUTH =================
  checkAuth: async () => {
    set({ checkingAuth: true });

    try {
      const res = await api.get("/auth/profile");

      set({
        user: res.data,
        checkingAuth: false,
      });

      // 🔥 IMPORTANT: load cart AFTER restoring session
      await cartStore.getState().getCartItems();
    } catch (error) {
      set({
        user: null,
        checkingAuth: false,
      });

      // 🔥 ALSO CLEAR CART if not authenticated
      cartStore.getState().clearCart();

      console.log("Auth check failed:", error);
    }
  },
}));

export default userStore;