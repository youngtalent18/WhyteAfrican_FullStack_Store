import { Link, NavLink } from "react-router-dom";
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
  UserRound,
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

const Navbar = ({
  search,
  setSearch,
  isModalOpen,
  setModalOpen,
  view,
  setView,
}) => {
  const { user, logout } = userStore();
  const { cart } = cartStore();
  const isAdmin = user?.role === "admin";

  const [menuOpen, setMenuOpen] = useState(false);
  const mobileLinkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-md p-2 transition ${
      isActive
        ? "bg-indigo-600/15 text-indigo-200 ring-1 ring-indigo-500/25"
        : "text-slate-200 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <div className="sticky top-0 z-50 bg-[#111827] border-b border-slate-800">
      {/* TOP BAR */}
      <div className="flex items-center justify-between px-4 py-3">

        {/* LOGO */}
        <Link
          to="/"
          className="font-bold text-xl text-indigo-500"
        >
          WhyteAfrican
        </Link>

        {/* SEARCH */}
        <div className="hidden sm:flex flex-1 max-w-xl mx-4">
          <Search search={search} setSearch={setSearch} />
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-5 text-slate-200">

          <Link className="hover:text-white" to="/">
            Home
          </Link>

          {user && (
            <Link
              to="/profile"
              className="flex items-center gap-1 hover:text-white"
            >
              <UserRound size={15} />
              Profile
            </Link>
          )}

          {user && (
            <Link
              to="/orders"
              className="flex items-center gap-1 hover:text-white"
            >
              <Package size={15} />
              Orders
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/dashboard"
              className="flex items-center gap-1 px-3 py-1 rounded bg-indigo-500 hover:bg-indigo-400 text-white"
            >
              <Lock size={15} />
              Admin
            </Link>
          )}

          {user ? (
            <button
              onClick={logout}
              className="flex items-center gap-1 px-3 py-1 rounded bg-red-500 hover:bg-red-600 cursor-pointer text-white"
            >
              <LogOut size={15} />
              Logout
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  setView("signup");
                  setModalOpen(true);
                }}
                className="flex items-center gap-1 hover:text-white"
              >
                <UserPlus size={15} />
                Signup
              </button>

              <button
                onClick={() => {
                  setView("login");
                  setModalOpen(true);
                }}
                className="flex items-center gap-1 px-3 py-1 rounded text-white"
              >
                <LogIn size={15} />
                Login
              </button>
            </>
          )}

          {user && (
            <Link to="/cart" className="relative text-slate-200 hover:text-white">
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-500 text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>
          )}
        </div>

        {/* MOBILE ICONS */}
        <div className="flex items-center gap-3 md:hidden">

          {user && (
            <Link to="/cart" className="relative text-white">
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-500 text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>
          )}

          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white">
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
        <div className="fixed inset-0 z-50 bg-black/70 md:hidden">
          <div className="absolute left-0 top-0 w-[85%] max-w-sm h-full bg-[#0f172a] flex flex-col">

            {/* HEADER */}
            <div className="flex justify-between items-center p-4 border-b border-slate-800">
              <h2 className="text-white font-semibold">Menu</h2>
              <button onClick={() => setMenuOpen(false)}>
                <X className="text-white" />
              </button>
            </div>

            {/* LINKS */}
            <div className="flex-1 p-4 space-y-2 text-slate-200">

              <NavLink
                to="/"
                onClick={() => setMenuOpen(false)}
                className={mobileLinkClass}
              >
                <Home size={18} />
                Home
              </NavLink>

              {user && (
                <NavLink
                  to="/cart"
                  onClick={() => setMenuOpen(false)}
                  className={mobileLinkClass}
                >
                  <ShoppingCart size={18} />
                  Cart ({cart.length})
                </NavLink>
              )}

              {user && (
                <NavLink
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className={mobileLinkClass}
                >
                  <UserRound size={18} />
                  Profile
                </NavLink>
              )}

              {user && (
                <NavLink
                  to="/orders"
                  onClick={() => setMenuOpen(false)}
                  className={mobileLinkClass}
                >
                  <Package size={18} />
                  Orders
                </NavLink>
              )}

              {isAdmin && (
                <NavLink
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className={mobileLinkClass}
                >
                  <Lock size={18} />
                  Admin Panel
                </NavLink>
              )}
            </div>

            {/* AUTH */}
            <div className="p-4 border-t border-slate-800 space-y-3">

              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="w-full bg-red-500 hover:bg-red-400 py-2 rounded text-white"
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
                    className="w-full bg-indigo-600 hover:bg-indigo-500 py-2 rounded text-white"
                  >
                    Login
                  </button>

                  <button
                    onClick={() => {
                      setView("signup");
                      setModalOpen(true);
                      setMenuOpen(false);
                    }}
                    className="w-full border border-indigo-600 text-indigo-500 py-2 rounded"
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
