import { Link } from "react-router-dom";
import {
  Lock,
  LogIn,
  LogOut,
  ShoppingCart,
  UserPlus,
  Package,
  Menu,
  X,
  Home,
} from "lucide-react";

import Search from "../Components/Search.jsx";
import Modal from "../Components/Modal.jsx";
import Login from "../auth/Login.jsx";
import ForgotPassword from "../auth/ForgotPassword.jsx";
import SignUp from "../auth/SignUp.jsx";
import ResetPassword from "../auth/Reset.jsx";

import { useState } from "react";
import userStore from "../store/userStore.js";
import cartStore from "../store/cartStore.js";

const Navbar = ({ search, setSearch, isModalOpen, setModalOpen, view, setView }) => {
  const { user, logout } = userStore();
  const { cart } = cartStore();

  const isAdmin = user?.role === "admin";
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 bg-[#0B1220]/95 backdrop-blur border-b border-[#1E293B]">
      
      {/* ================= TOP BAR ================= */}
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">

        {/* LOGO */}
        <Link
          to="/"
          className="font-bold text-xl text-white tracking-tight hover:text-[#4F8CFF] transition"
        >
          WhyteAfrican
        </Link>

        {/* SEARCH */}
        <div className="hidden sm:flex flex-1 max-w-md mx-6">
          <Search search={search} setSearch={setSearch} />
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-4 text-sm text-gray-300">

          <Link className="hover:text-white transition" to="/">
            Home
          </Link>

          {user && (
            <Link
              to="/orders"
              className="flex items-center gap-1 hover:text-white transition"
            >
              <Package size={15} />
              Orders
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/dashboard"
              className="flex items-center gap-1 px-3 py-1.5 bg-[#4F8CFF] text-white rounded-lg hover:opacity-90 transition"
            >
              <Lock size={14} />
              Dashboard
            </Link>
          )}

          {user ? (
            <button
              onClick={logout}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-500/90 hover:bg-red-500 text-white rounded-lg transition"
            >
              <LogOut size={14} />
              Logout
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  setView("signup");
                  setModalOpen(true);
                }}
                className="flex items-center gap-1 px-3 py-1.5 border border-[#334155] rounded-lg hover:bg-[#111A2E] transition"
              >
                <UserPlus size={14} />
                Signup
              </button>

              <button
                onClick={() => {
                  setView("login");
                  setModalOpen(true);
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#4F8CFF] text-white rounded-lg hover:opacity-90 transition"
              >
                <LogIn size={14} />
                Login
              </button>
            </>
          )}

          {user && (
            <Link to="/cart" className="relative ml-2">
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#22C55E] text-[10px] w-5 h-5 flex items-center justify-center rounded-full text-black font-semibold">
                  {cart.length}
                </span>
              )}
            </Link>
          )}
        </div>

        {/* MOBILE */}
        <div className="flex items-center gap-3 md:hidden text-white">

          {user && (
            <Link to="/cart" className="relative">
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#22C55E] text-[10px] w-5 h-5 flex items-center justify-center rounded-full text-black font-semibold">
                  {cart.length}
                </span>
              )}
            </Link>
          )}

          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* MOBILE SEARCH */}
      <div className="sm:hidden px-4 pb-3">
        <Search search={search} setSearch={setSearch} />
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 md:hidden">
          <div className="absolute left-0 top-0 w-[85%] max-w-sm h-full bg-[#0B1220] flex flex-col">

            <div className="flex justify-between items-center p-4 border-b border-[#1E293B]">
              <h2 className="text-white font-semibold">Menu</h2>
              <button onClick={() => setMenuOpen(false)}>
                <X />
              </button>
            </div>

            <div className="flex-1 p-4 space-y-2 text-gray-300">

              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#111A2E] transition"
              >
                <Home size={18} />
                Home
              </Link>

              {user && (
                <Link
                  to="/cart"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#111A2E] transition"
                >
                  <ShoppingCart size={18} />
                  Cart
                  <span className="ml-auto bg-[#22C55E] px-2 rounded-full text-xs text-black font-semibold">
                    {cart.length}
                  </span>
                </Link>
              )}

              {user && (
                <Link
                  to="/orders"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#111A2E] transition"
                >
                  <Package size={18} />
                  Orders
                </Link>
              )}

              {isAdmin && (
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 p-2 text-[#4F8CFF]"
                >
                  <Lock size={18} />
                  Admin Dashboard
                </Link>
              )}
            </div>

            <div className="p-4 border-t border-[#1E293B] space-y-3">

              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="w-full bg-red-500 py-2 rounded-lg text-white"
                >
                  Logout
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setView("login");
                      setModalOpen(true);
                      setMenuOpen(false);
                    }}
                    className="w-full bg-[#4F8CFF] py-2 rounded-lg text-white"
                  >
                    Login
                  </button>

                  <button
                    onClick={() => {
                      setView("signup");
                      setModalOpen(true);
                      setMenuOpen(false);
                    }}
                    className="w-full border border-[#334155] py-2 rounded-lg text-gray-300"
                  >
                    Create Account
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL */}
      <Modal isModalOpen={isModalOpen} setModalOpen={setModalOpen}>
        {view === "login" && (
          <Login setView={setView} setModalOpen={setModalOpen} />
        )}
        {view === "signup" && (
          <SignUp setView={setView} setModalOpen={setModalOpen} />
        )}
        {view === "forgot" && <ForgotPassword setView={setView} />}
        {view === "reset" && <ResetPassword setView={setView} />}
      </Modal>
    </div>
  );
};

export default Navbar;