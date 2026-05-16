import { useEffect, useState } from "react";
import { Loader, Mail, RefreshCw, UserRound, UsersRound } from "lucide-react";
import api from "../../api/axios.js";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/analytics/stats/users");
      setUsers(res.data?.users || []);
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
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UserPage;
