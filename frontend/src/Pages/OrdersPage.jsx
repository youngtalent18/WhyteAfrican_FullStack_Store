import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgePercent,
  Package,
  ReceiptText,
  ShoppingBag,
  Wallet,
} from "lucide-react";
import cartStore from "../store/cartStore";
import FloatingContact from "../Components/ContactUs.jsx";
import BackButton from "../Components/BackButton.jsx";

const OrdersPage = () => {
  const { orders, getOrders } = cartStore();

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  const totalSpent = orders.reduce(
    (sum, order) => sum + Number(order.totalAmount || 0),
    0
  );
  const totalDiscount = orders.reduce(
    (sum, order) => sum + Number(order.discountAmount || 0),
    0
  );

  const formatCurrency = (value = 0) => `GHC ${Number(value || 0).toFixed(2)}`;

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-10">
      <FloatingContact />

      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <BackButton label="Back to account" />

          <div className="text-left sm:text-right">
            <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight sm:justify-end sm:text-3xl">
              <ReceiptText size={24} className="text-indigo-300" />
              My Orders
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Track your purchases and order history
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-sm text-slate-400">Total Orders</p>
            <p className="mt-1 text-2xl font-bold">{orders.length}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-sm text-slate-400">Total Spent</p>
            <p className="mt-1 text-2xl font-bold">
              {formatCurrency(totalSpent)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-sm text-slate-400">Discount Saved</p>
            <p className="mt-1 text-2xl font-bold text-indigo-200">
              {formatCurrency(totalDiscount)}
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400 sm:p-14">
            <ShoppingBag className="mx-auto mb-4 text-slate-500" size={42} />
            <h2 className="text-lg font-semibold text-white">No orders yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm">
              When you place an order, it will appear here with payment and item
              details.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
            >
              Start Shopping
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order._id}
                className="overflow-hidden rounded-2xl border border-slate-800 bg-linear-to-b from-slate-900 to-slate-950 shadow-lg shadow-black/30"
              >
                <div className="flex flex-col gap-4 border-b border-slate-800/70 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-6">
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">
                      Order Reference
                    </p>
                    <p className="mt-1 break-all text-sm text-slate-200">
                      {order.paymentReference}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-200 ring-1 ring-indigo-500/20">
                      {order.status}
                    </span>
                    <p className="mt-2 text-base font-semibold text-white">
                      {formatCurrency(order.totalAmount)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 border-b border-slate-800/60 px-4 py-4 text-sm sm:grid-cols-3 sm:px-6">
                  <div className="rounded-lg bg-slate-950/70 p-3">
                    <p className="flex items-center gap-2 text-xs uppercase text-slate-500">
                      <Wallet size={14} />
                      Subtotal
                    </p>
                    <p className="mt-1 text-slate-200">
                      {formatCurrency(order.subtotal || order.totalAmount)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-950/70 p-3">
                    <p className="flex items-center gap-2 text-xs uppercase text-slate-500">
                      <BadgePercent size={14} />
                      Discount
                    </p>
                    <p className="mt-1 text-slate-200">
                      {order.discountPercentage > 0
                        ? `${order.discountPercentage}% (${formatCurrency(
                            order.discountAmount
                          )})`
                        : "None"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-950/70 p-3">
                    <p className="flex items-center gap-2 text-xs uppercase text-slate-500">
                      <Package size={14} />
                      Items
                    </p>
                    <p className="mt-1 text-slate-200">
                      {order.items?.length || 0} item(s)
                    </p>
                  </div>
                </div>

                <div className="space-y-3 p-4 sm:p-6">
                  {order.items?.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-4 rounded-xl border border-slate-800/70 bg-slate-950/50 p-3 transition hover:border-indigo-500/30"
                    >
                      <img
                        src={
                          item.product?.image?.replace(
                            "/upload/",
                            "/upload/w_200,q_auto,f_auto/"
                          ) || "/fallback.png"
                        }
                        alt={item.name}
                        className="h-14 w-14 rounded-lg border border-slate-700 object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-slate-200">
                          {item.name}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          Quantity: {item.quantity}
                          {item.size ? ` • Size: ${item.size}` : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
