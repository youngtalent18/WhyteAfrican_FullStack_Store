import { useEffect, useState } from "react";
import {
  Check,
  Clipboard,
  Loader,
  Mail,
  RefreshCw,
  UserRound,
  UsersRound,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios.js";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedUserId, setCopiedUserId] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/analytics/stats/users");
      setUsers(res.data);
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

  return (
    <div className="w-full space-y-4 text-white">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold sm:text-xl">
            <UsersRound size={20} className="text-indigo-400" />
            User Management
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            View registered customer accounts and contact details.
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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
          <p className="text-sm text-slate-400">Total Users</p>
          <p className="mt-1 text-2xl font-bold">{users.length}</p>
        </div>
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
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-lg border border-slate-700 md:block">
            <table className="min-w-full divide-y divide-slate-700">
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
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-slate-300">
                    Coupon
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-700 bg-slate-800/70">
                {users.map((user) => (
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
            {users.map((user) => (
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
                  </div>
                </div>

                <div className="mt-3 rounded-md bg-slate-900/70 p-3">
                  <p className="text-xs uppercase text-slate-500">User ID</p>
                  <p className="mt-1 break-all font-mono text-xs text-slate-300">
                    {user._id}
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
