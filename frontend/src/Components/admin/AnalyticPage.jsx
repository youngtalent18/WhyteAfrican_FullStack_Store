import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BadgePercent,
  BarChart3,
  Loader,
  PackageCheck,
  RefreshCw,
  ShoppingBag,
  UsersRound,
  Wallet,
} from "lucide-react";
import api from "../../api/axios.js";

const AnalyticPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/analytics/stats");
      setData(res.data);
    } catch (err) {
      console.error("Analytics error:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatCurrency = (value = 0) => `GHC ${Number(value || 0).toFixed(2)}`;

  const topProduct = useMemo(() => data?.productStats?.[0], [data]);

  const metricCards = [
    {
      label: "Total Revenue",
      value: formatCurrency(data?.totalRevenue),
      icon: Wallet,
      tone: "text-indigo-300",
    },
    {
      label: "Total Orders",
      value: data?.totalOrders || 0,
      icon: ShoppingBag,
      tone: "text-sky-300",
    },
    {
      label: "Total Users",
      value: data?.totalUsers || 0,
      icon: UsersRound,
      tone: "text-violet-300",
    },
    {
      label: "Total Discount",
      value: formatCurrency(data?.totalDiscount),
      icon: BadgePercent,
      tone: "text-amber-300",
    },
  ];

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 p-8 text-sm text-slate-300">
        <Loader className="animate-spin" size={18} />
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 text-white">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold sm:text-xl">
            <BarChart3 size={20} className="text-indigo-400" />
            Analytics Overview
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Track revenue, order activity, and best-performing products.
          </p>
        </div>

        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-lg border border-slate-700 bg-slate-800 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-slate-400">{item.label}</p>
                <Icon size={18} className={item.tone} />
              </div>
              <p className="mt-2 text-2xl font-bold">{item.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4 sm:p-5">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold uppercase text-slate-300">
                Product Performance
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Top products by quantity sold.
              </p>
            </div>
            {topProduct && (
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-200">
                <PackageCheck size={14} />
                Leader: {topProduct.name}
              </span>
            )}
          </div>

          {data?.productStats?.length > 0 ? (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.productStats} margin={{ left: -20, right: 8 }}>
                  <CartesianGrid stroke="#1e293b" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(99, 102, 241, 0.08)" }}
                    contentStyle={{
                      background: "#0f172a",
                      border: "1px solid rgba(99, 102, 241, 0.35)",
                      borderRadius: "8px",
                      color: "#e0e7ff",
                    }}
                  />
                  <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-8 text-center text-sm text-slate-400">
              No product stats available yet.
            </div>
          )}
        </div>

        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4 sm:p-5">
          <h3 className="text-sm font-semibold uppercase text-slate-300">
            Recent Orders
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Latest order totals from checkout.
          </p>

          <div className="mt-4 space-y-3">
            {data?.recentOrders?.length > 0 ? (
              data.recentOrders.map((order, index) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between gap-3 rounded-md bg-slate-900/70 p-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium">Order #{index + 1}</p>
                    <p className="truncate font-mono text-xs text-slate-500">
                      {order._id}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-indigo-200">
                    {formatCurrency(order.totalAmount)}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-md bg-slate-900/70 p-5 text-center text-sm text-slate-400">
                No recent orders yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticPage;
