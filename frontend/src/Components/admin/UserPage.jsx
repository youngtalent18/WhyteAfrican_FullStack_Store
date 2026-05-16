import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Clipboard,
  Crown,
  Loader,
  Mail,
  Search,
  RefreshCw,
  ShieldCheck,
  ShieldX,
  ShoppingBag,
  UserRound,
  UsersRound,
  Wallet,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios.js";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedUserId, setCopiedUserId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [orderFilter, setOrderFilter] = useState("all");
  const [sortBy, setSortBy] = useState("orders");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/analytics/stats/users");
      const fetchedUsers = Array.isArray(res.data) ? res.data : res.data?.users;
      setUsers(fetchedUsers || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const copyUserId = async (userId) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(userId);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = userId;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopiedUserId(userId);
      toast.success("User ID copied for coupon", {
        duration: 2000,
        id: "user-id-copied",
      });

      setTimeout(() => {
        setCopiedUserId((currentId) => (currentId === userId ? "" : currentId));
      }, 2000);
    } catch (err) {
      console.error("Copy user ID failed:", err);
      toast.error("Could not copy user ID", {
        duration: 2500,
        id: "user-id-copy-failed",
      });
    }
  };

  const VerificationBadge = ({ isVerified }) => (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
        isVerified
          ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-200"
          : "border-slate-600 bg-slate-700/70 text-slate-300"
      }`}
    >
      {isVerified ? <ShieldCheck size={13} /> : <ShieldX size={13} />}
      {isVerified ? "Verified" : "Not Verified"}
    </span>
  );

  const formatCurrency = (value = 0) =>
    `GHC ${Number(value || 0).toFixed(2)}`;

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "No orders yet";

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return users
      .filter((user) => {
        const matchesSearch =
          !normalizedSearch ||
          user.name?.toLowerCase().includes(normalizedSearch) ||
          user.email?.toLowerCase().includes(normalizedSearch) ||
          user._id?.toLowerCase().includes(normalizedSearch);

        const matchesVerification =
          verificationFilter === "all" ||
          (verificationFilter === "verified" && user.isVerified) ||
          (verificationFilter === "unverified" && !user.isVerified);

        const matchesOrders =
          orderFilter === "all" ||
          (orderFilter === "with-orders" && user.totalOrders > 0) ||
          (orderFilter === "no-orders" && !user.totalOrders);

        return matchesSearch && matchesVerification && matchesOrders;
      })
      .sort((a, b) => {
        if (sortBy === "spent") {
          return (b.totalSpent || 0) - (a.totalSpent || 0);
        }

        if (sortBy === "name") {
          return (a.name || "").localeCompare(b.name || "");
        }

        if (sortBy === "newest") {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }

        return (b.totalOrders || 0) - (a.totalOrders || 0);
      });
  }, [orderFilter, searchTerm, sortBy, users, verificationFilter]);

  const topCustomers = useMemo(
    () =>
      [...users]
        .filter((user) => user.totalOrders > 0)
        .sort((a, b) => {
          const orderDifference = (b.totalOrders || 0) - (a.totalOrders || 0);
          return orderDifference || (b.totalSpent || 0) - (a.totalSpent || 0);
        })
        .slice(0, 3),
    [users]
  );

  const verifiedCount = users.filter((user) => user.isVerified).length;
  const customersWithOrders = users.filter((user) => user.totalOrders > 0).length;
  const totalCustomerRevenue = users.reduce(
    (sum, user) => sum + (user.totalSpent || 0),
    0
  );

  return (
    <div className="w-full space-y-4 text-white">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center justify-center gap-2 text-lg font-semibold sm:text-xl">
            <UsersRound size={20} className="text-indigo-400" />
            User Management
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Search users, find top customers, and copy IDs for coupons.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
          <p className="text-sm text-slate-400">Total Users</p>
          <p className="mt-1 text-2xl font-bold">{users.length}</p>
        </div>
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
          <p className="text-sm text-slate-400">Verified Users</p>
          <p className="mt-1 text-2xl font-bold text-indigo-300">
            {verifiedCount}
          </p>
        </div>
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
          <p className="text-sm text-slate-400">Customers With Orders</p>
          <p className="mt-1 text-2xl font-bold">{customersWithOrders}</p>
        </div>
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
          <p className="text-sm text-slate-400">Customer Revenue</p>
          <p className="mt-1 text-2xl font-bold">
            {formatCurrency(totalCustomerRevenue)}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
        <div className="mb-3 flex items-center gap-2">
          <Crown size={18} className="text-indigo-300" />
          <h3 className="text-sm font-semibold uppercase text-slate-300">
            Top Customers
          </h3>
        </div>

        {topCustomers.length === 0 ? (
          <p className="text-sm text-slate-400">No customer orders yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            {topCustomers.map((user, index) => (
              <div
                key={user._id}
                className="rounded-lg border border-indigo-500/20 bg-slate-900/60 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-indigo-300">#{index + 1}</p>
                    <p className="truncate text-sm font-semibold">
                      {user.name || "Unnamed user"}
                    </p>
                    <p className="truncate text-xs text-slate-400">
                      {user.email}
                    </p>
                  </div>
                  <Crown size={17} className="shrink-0 text-indigo-300" />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-md bg-slate-800 p-2">
                    <p className="text-slate-500">Orders</p>
                    <p className="mt-1 font-semibold">{user.totalOrders}</p>
                  </div>
                  <div className="rounded-md bg-slate-800 p-2">
                    <p className="text-slate-500">Spent</p>
                    <p className="mt-1 font-semibold">
                      {formatCurrency(user.totalSpent)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-lg border border-slate-700 bg-slate-800 p-4 lg:grid-cols-[1fr_auto_auto_auto]">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or user ID"
            className="w-full rounded-md border border-slate-700 bg-slate-900 py-2 pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500"
          />
        </div>

        <select
          value={verificationFilter}
          onChange={(e) => setVerificationFilter(e.target.value)}
          className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none transition focus:border-indigo-500"
        >
          <option value="all">All status</option>
          <option value="verified">Verified</option>
          <option value="unverified">Not verified</option>
        </select>

        <select
          value={orderFilter}
          onChange={(e) => setOrderFilter(e.target.value)}
          className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none transition focus:border-indigo-500"
        >
          <option value="all">All customers</option>
          <option value="with-orders">With orders</option>
          <option value="no-orders">No orders</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none transition focus:border-indigo-500"
        >
          <option value="orders">Most orders</option>
          <option value="spent">Highest spend</option>
          <option value="newest">Newest users</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading && users.length === 0 ? (
        <div className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 p-8 text-sm text-slate-300">
          <Loader size={18} className="animate-spin" />
          Loading users...
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-8 text-center text-sm text-slate-400">
          No users found.
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-8 text-center text-sm text-slate-400">
          No users match your filters.
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-lg border border-slate-700 md:block">
            <table className="min-w-280 divide-y divide-slate-700">
              <thead className="bg-slate-800">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-300">
                    User ID
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-300">
                    Name
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-300">
                    Email
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-300">
                    Status
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-300">
                    Orders
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-300">
                    Total Spent
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-300">
                    Last Order
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-slate-300">
                    Coupon
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-700 bg-slate-800/70">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="transition hover:bg-slate-700/70">
                    <td className="max-w-xs px-5 py-4 font-mono text-xs text-slate-300">
                      {user._id}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-300">
                          <UserRound size={17} />
                        </div>
                        <span className="text-sm font-medium">
                          {user.name || "Unnamed user"}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-300">
                      {user.email}
                    </td>
                    <td className="px-5 py-4">
                      <VerificationBadge isVerified={user.isVerified} />
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-300">
                      <span className="inline-flex items-center gap-1.5">
                        <ShoppingBag size={14} className="text-slate-500" />
                        {user.totalOrders || 0}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-300">
                      <span className="inline-flex items-center gap-1.5">
                        <Wallet size={14} className="text-slate-500" />
                        {formatCurrency(user.totalSpent)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-300">
                      {formatDate(user.lastOrderAt)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => copyUserId(user._id)}
                        className="inline-flex items-center justify-center gap-2 rounded-md border border-indigo-500/40 bg-indigo-500/10 px-3 py-2 text-xs font-medium text-indigo-200 transition hover:border-indigo-400 hover:bg-indigo-500/20"
                        title="Copy user ID for user-specific coupon"
                      >
                        {copiedUserId === user._id ? (
                          <>
                            <Check size={14} />
                            Copied
                          </>
                        ) : (
                          <>
                            <Clipboard size={14} />
                            Copy ID
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="rounded-lg border border-slate-700 bg-slate-800 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-300">
                    <UserRound size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {user.name || "Unnamed user"}
                    </p>
                    <p className="mt-1 flex items-center gap-2 truncate text-sm text-slate-300">
                      <Mail size={14} className="shrink-0 text-slate-400" />
                      {user.email}
                    </p>
                    <div className="mt-2">
                      <VerificationBadge isVerified={user.isVerified} />
                    </div>
                  </div>
                </div>

                <div className="mt-3 rounded-md bg-slate-900/70 p-3">
                  <p className="text-xs uppercase text-slate-500">User ID</p>
                  <p className="mt-1 break-all font-mono text-xs text-slate-300">
                    {user._id}
                  </p>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-md bg-slate-900/70 p-3">
                    <p className="text-slate-500">Orders</p>
                    <p className="mt-1 font-semibold text-slate-200">
                      {user.totalOrders || 0}
                    </p>
                  </div>
                  <div className="rounded-md bg-slate-900/70 p-3">
                    <p className="text-slate-500">Spent</p>
                    <p className="mt-1 font-semibold text-slate-200">
                      {formatCurrency(user.totalSpent)}
                    </p>
                  </div>
                </div>

                <div className="mt-2 rounded-md bg-slate-900/70 p-3 text-xs">
                  <p className="text-slate-500">Last Order</p>
                  <p className="mt-1 text-slate-300">
                    {formatDate(user.lastOrderAt)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => copyUserId(user._id)}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-indigo-500/40 bg-indigo-500/10 px-3 py-2 text-sm font-medium text-indigo-200 transition hover:border-indigo-400 hover:bg-indigo-500/20"
                >
                  {copiedUserId === user._id ? (
                    <>
                      <Check size={16} />
                      Copied for Coupon
                    </>
                  ) : (
                    <>
                      <Clipboard size={16} />
                      Copy ID for Coupon
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UserPage;
