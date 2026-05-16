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
import ProfilePage from "./Pages/ProfilePage.jsx";
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

const AUTO_REFRESH_AFTER_MS = 30 * 60 * 1000;

function AppContent() {
  const location = useLocation();

  const { user, checkAuth, checkingAuth } = userStore();
  const { initializeStore } = cartStore();
  const {fetchAllProducts} = useProductStore();

  const [search, setSearch] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [view, setView] = useState("login");

  useEffect(() => {
    const pageOpenedAt = Date.now();

    const refreshPage = () => {
      window.location.reload();
    };

    const refreshTimerId = window.setTimeout(refreshPage, AUTO_REFRESH_AFTER_MS);

    const refreshWhenReturningAfterLongVisit = () => {
      const hasBeenOpenTooLong = Date.now() - pageOpenedAt >= AUTO_REFRESH_AFTER_MS;

      if (document.visibilityState === "visible" && hasBeenOpenTooLong) {
        refreshPage();
      }
    };

    document.addEventListener("visibilitychange", refreshWhenReturningAfterLongVisit);

    return () => {
      window.clearTimeout(refreshTimerId);
      document.removeEventListener("visibilitychange", refreshWhenReturningAfterLongVisit);
    };
  }, []);

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

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#0f172a",
            color: "#c7d2fe",
            border: "1px solid rgba(99, 102, 241, 0.35)",
            borderRadius: "10px",
            boxShadow: "0 18px 45px rgba(2, 6, 23, 0.35)",
            fontSize: "14px",
            fontWeight: 500,
            padding: "12px 14px",
          },
          iconTheme: {
            primary: "#818cf8",
            secondary: "#0f172a",
          },
          success: {
            style: {
              background: "#0f172a",
              color: "#c7d2fe",
              border: "1px solid rgba(99, 102, 241, 0.45)",
            },
            iconTheme: {
              primary: "#818cf8",
              secondary: "#0f172a",
            },
          },
          error: {
            style: {
              background: "#0f172a",
              color: "#c7d2fe",
              border: "1px solid rgba(129, 140, 248, 0.45)",
            },
            iconTheme: {
              primary: "#a5b4fc",
              secondary: "#0f172a",
            },
          },
        }}
      />

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

        {/* PROFILE */}
        <Route
          path="/profile"
          element={user ? <ProfilePage /> : <Navigate to="/" />}
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
