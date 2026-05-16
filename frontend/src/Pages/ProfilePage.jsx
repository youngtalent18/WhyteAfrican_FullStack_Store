import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Mail,
  Package,
  Shield,
  ShoppingCart,
  UserRound,
  Wallet,
} from "lucide-react";
import { useEffect } from "react";
import userStore from "../store/userStore";
import cartStore from "../store/cartStore";
import FloatingContact from "../Components/ContactUs.jsx";

const ProfilePage = () => {
  const { user } = userStore();
  const { cart, orders, getOrders, subtotal } = cartStore();

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const totalSpent = orders.reduce(
    (sum, order) => sum + Number(order.totalAmount || 0),
    0
  );

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  const profileStats = [
    {
      label: "Orders",
      value: orders.length,
      icon: Package,
    },
    {
      label: "Cart Items",
      value: cart.length,
      icon: ShoppingCart,
    },
    {
      label: "Total Spent",
      value: `GHC ${totalSpent.toFixed(2)}`,
      icon: Wallet,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-10">
      <FloatingContact />

      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-2xl border border-slate-800 bg-linear-to-br from-slate-900 to-slate-950 p-5 shadow-xl shadow-black/25 sm:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/10 text-2xl font-bold text-indigo-200">
                {initials || <UserRound size={30} />}
              </div>

              <div className="min-w-0">
                <p className="text-sm text-slate-400">My Account</p>
                <h1 className="truncate text-2xl font-bold sm:text-3xl">
                  {user?.name || "Customer"}
                </h1>
                <p className="mt-1 flex items-center gap-2 text-sm text-slate-400">
                  <Mail size={15} />
                  {user?.email}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-sm text-indigo-200">
                <Shield size={15} />
                {user?.role || "customer"}
              </span>
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${
                  user?.isVerified
                    ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-200"
                    : "border-amber-500/30 bg-amber-500/10 text-amber-200"
                }`}
              >
                <BadgeCheck size={15} />
                {user?.isVerified ? "Verified" : "Not verified"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {profileStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-xl border border-slate-800 bg-slate-900 p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-400">{stat.label}</p>
                  <Icon size={18} className="text-indigo-300" />
                </div>
                <p className="mt-2 text-2xl font-bold">{stat.value}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-lg font-semibold">Account Details</h2>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-800 p-4">
                <p className="text-xs uppercase text-slate-500">Full Name</p>
                <p className="mt-1 text-sm text-slate-200">{user?.name}</p>
              </div>
              <div className="rounded-xl bg-slate-800 p-4">
                <p className="text-xs uppercase text-slate-500">Email</p>
                <p className="mt-1 break-all text-sm text-slate-200">
                  {user?.email}
                </p>
              </div>
              <div className="rounded-xl bg-slate-800 p-4">
                <p className="text-xs uppercase text-slate-500">Member Since</p>
                <p className="mt-1 flex items-center gap-2 text-sm text-slate-200">
                  <CalendarDays size={15} className="text-slate-500" />
                  {joinedDate}
                </p>
              </div>
              <div className="rounded-xl bg-slate-800 p-4">
                <p className="text-xs uppercase text-slate-500">Cart Value</p>
                <p className="mt-1 text-sm text-slate-200">
                  GHC {Number(subtotal || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-lg font-semibold">Quick Actions</h2>

            <div className="mt-5 space-y-3">
              <Link
                to="/orders"
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 transition hover:border-indigo-500/40 hover:text-indigo-200"
              >
                <span className="flex items-center gap-2">
                  <Package size={16} />
                  View Orders
                </span>
                <span className="flex items-center gap-2 text-slate-400">
                  {orders.length}
                  <ArrowRight size={15} />
                </span>
              </Link>

              <Link
                to="/cart"
                className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-200 transition hover:border-indigo-500/40 hover:text-indigo-200"
              >
                <span className="flex items-center gap-2">
                  <ShoppingCart size={16} />
                  Open Cart
                </span>
                <span className="flex items-center gap-2 text-slate-400">
                  {cart.length}
                  <ArrowRight size={15} />
                </span>
              </Link>

              <Link
                to="/"
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-indigo-500"
              >
                Continue Shopping
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-lg font-semibold">Recent Orders</h2>

          {orders.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">
              You have not placed any orders yet.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {orders.slice(0, 3).map((order) => (
                <div
                  key={order._id}
                  className="flex flex-col gap-2 rounded-xl bg-slate-700 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-200">
                      {order.paymentReference}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {order.items?.length || 0} item(s)
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:block sm:text-right">
                    <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs text-indigo-200">
                      {order.status}
                    </span>
                    <p className="mt-1 text-sm font-semibold text-white">
                      GHC {Number(order.totalAmount || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
