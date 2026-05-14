import Navbar from "./Components/Navbar.jsx";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import Home from "./Pages/Home.jsx";
import CartPage from "./Pages/CartPage.jsx";
import AdminPage from "./Pages/AdminPage.jsx";
import CategoryPage from "./Pages/CategoryPage.jsx";
import OrdersPage from "./Pages/OrdersPage.jsx";
import PaymentSuccess from "./Components/PaymentSuccess.jsx";
import ProductDetails from "./Components/ProductDetails.jsx";
import SearchPage from "./Pages/SearchPage.jsx";

import ResetPassword from "./auth/Reset.jsx";
import VerifyEmail from "./auth/VerifyEmail.jsx";

import { Toaster, toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

import userStore from "./store/userStore.js";
import cartStore from "./store/cartStore.js";
import useProductStore from "./store/productStore.js";

function AppContent() {
  const location = useLocation();

  const { user, checkAuth, checkingAuth } = userStore();
  const { initializeStore } = cartStore();
  const {fetchAllProducts} = useProductStore();

  const [search, setSearch] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [view, setView] = useState("login");

  // ================= HIDE NAVBAR =================
  const hideNavbar =
    location.pathname.startsWith("/reset-password") ||
    location.pathname.startsWith("/verify-email");

  // ================= AUTH CHECK (RUN ONCE) =================
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    fetch("https://whyteafrican-fullstack-store.onrender.com/api/health")
      .then(() => {
        // THEN load products
        fetchAllProducts();
      })
      .catch(console.error);
  }, [fetchAllProducts]);

  // ================= LOGIN MODAL HANDLER =================
  useEffect(() => {
    const state = location.state;

    if (!state) return;

    if (state.openLogin) {
      queueMicrotask(() => {
        setModalOpen(true);
        setView("login");
      });
    }

    if (state.verified) {
      toast.success("Email verified! You can now log in.", {
        id: "verify-success",
      });
    }

    window.history.replaceState({}, "", location.pathname);
  }, [location.state, location.pathname]);

  // ================= CART + COUPON SYNC (FIXED) =================
  useEffect(() => {
    if (!checkingAuth && user?._id) {
      initializeStore();
    }
  }, [user, checkingAuth, initializeStore]);

  // ================= LOADING STATE =================
  if (checkingAuth) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center gap-2 text-white text-xl bg-linear-to-br from-[#0f172a] to-[#111827]">
        <Loader className="animate-spin text-indigo-400" size={30} />
        loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090e1a] text-slate-100">
      {/* NAVBAR */}
      {!hideNavbar && (
        <Navbar
          search={search}
          setSearch={setSearch}
          isModalOpen={isModalOpen}
          setModalOpen={setModalOpen}
          view={view}
          setView={setView}
        />
      )}

      <Toaster position="top-left" />

      {/* ROUTES */}
      <Routes>
        {/* HOME */}
        <Route path="/" element={<Home search={search} />} />

        {/* ADMIN */}
        <Route
          path="/dashboard"
          element={
            user?.role === "admin" ? <AdminPage /> : <Navigate to="/" />
          }
        />

        {/* CATEGORY */}
        <Route
          path="/category/:category"
          element={<CategoryPage search={search} />}
        />

        {/* SEARCH */}
        <Route path="/search" element={<SearchPage />} />

        {/* CART */}
        <Route
          path="/cart"
          element={user ? <CartPage /> : <Navigate to="/" />}
        />

        {/* PAYMENT SUCCESS */}
        <Route
          path="/payment-success"
          element={user ? <PaymentSuccess /> : <Navigate to="/" />}
        />

        {/* ORDERS */}
        <Route
          path="/orders"
          element={user ? <OrdersPage /> : <Navigate to="/" />}
        />

        {/* PRODUCT DETAILS */}
        <Route path="/products/:id" element={<ProductDetails />} />

        {/* AUTH */}
        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />

        <Route
          path="/verify-email/:token"
          element={<VerifyEmail />}
        />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}