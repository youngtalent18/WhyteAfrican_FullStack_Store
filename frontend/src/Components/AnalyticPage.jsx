import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Loader, RefreshCw } from "lucide-react";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get("/analytics/stats");
      setData(res.data);
    } catch (err) {
      console.log(err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center gap-2 text-white p-6 text-sm sm:text-base">
        <Loader className="animate-spin" size={18} />
        Loading admin dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 p-6">
        <p>{error}</p>

        <button
          onClick={fetchStats}
          className="mt-3 flex items-center gap-2 mx-auto bg-slate-700 px-4 py-2 rounded-md text-sm"
        >
          <RefreshCw className={`${loading ? "animate-spin" : ""}`} size={16} />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-6 text-white space-y-3">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-slate-700 px-3 py-2 rounded-md hover:bg-slate-600 disabled:opacity-50 text-sm w-full sm:w-auto"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

        {[
          { label: "Total Revenue", value: `GHC ${(data?.totalRevenue || 0).toFixed(2)}` },
          { label: "Total Orders", value: data?.totalOrders || 0 },
          { label: "Total Users", value: data?.totalUsers || 0 },
          { label: "Total Discount", value: `GHC ${(data?.totalDiscount || 0).toFixed(2)}` },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-slate-800 p-4 rounded-lg border border-slate-700"
          >
            <p className="text-gray-400 text-sm">{item.label}</p>
            <h2 className="text-lg sm:text-xl font-bold mt-1">
              {item.value}
            </h2>
          </div>
        ))}

      </div>

      {/* CHART */}
      <div className="bg-slate-800 p-3 sm:p-5 rounded-lg border border-slate-700">

        <h2 className="mb-3 font-semibold text-sm sm:text-base">
          Product Performance
        </h2>

        {data?.productStats?.length > 0 ? (
          <div className="w-full h-62.5 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.productStats}>
                <XAxis dataKey="name" stroke="#fff" tick={{ fontSize: 10 }} />
                <YAxis stroke="#fff" tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">
            No product stats available
          </p>
        )}

      </div>

    </div>
  );
};

export default AdminDashboard;