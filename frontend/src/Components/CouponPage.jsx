import { useEffect, useState } from "react";
import cartStore from "../store/cartStore";
import api from "../api/axios";
import toast from "react-hot-toast";

const CouponDashboard = () => {
  const { coupons, getAllCoupons, toggleCoupon, deleteCoupon } = cartStore();

  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [expiry, setExpiry] = useState("");
  const [type, setType] = useState("global");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllCoupons();
  }, [getAllCoupons]);

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!code || !discount || !expiry) {
      return toast.error("Fill all required fields", { duration: 3000 }, {id: "required-fields-error"});
    }

    if (discount <= 0 || discount > 100) {
      return toast.error("Discount must be between 1 and 100", { duration: 3000 }, {id: "discount-error"});
    }

    if (new Date(expiry) <= new Date()) {
      return toast.error("Expiry must be in the future", { duration: 3000 }, {id: "expiry-error"});
    }

    if (type === "user" && !userId) {
      return toast.error("User ID required", { duration: 3000 }, {id: "user-id-error"});
    }

    try {
      setLoading(true);

      await api.post("/coupon/admin/create", {
        code,
        discountPercentage: Number(discount),
        expiresAt: expiry,
        userId: type === "user" ? userId : null,
      });

      toast.success("Coupon created", { duration: 3000 }, {id: "create-success"});

      setCode("");
      setDiscount("");
      setExpiry("");
      setUserId("");
      setType("global");

      getAllCoupons();
    } catch (error) {
      toast.error(error.response?.data?.message || "Create failed", { duration: 3000 }, {id: "create-failed"});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white p-3 sm:p-6">

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">

        {/* ================= FORM ================= */}
        <form
          onSubmit={handleCreate}
          className="w-full lg:w-[40%] bg-slate-800 border border-slate-700 p-4 sm:p-6 rounded-xl space-y-4 h-fit"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-emerald-400">
            Create Coupon
          </h2>

          <div className="flex flex-col gap-3">

            <input
              type="text"
              placeholder="Coupon Code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="p-2 rounded bg-slate-700 outline-none text-sm sm:text-base"
            />

            <input
              type="number"
              placeholder="Discount %"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="p-2 rounded bg-slate-700 outline-none text-sm sm:text-base"
            />

            <input
              type="date"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="p-2 rounded bg-slate-700 outline-none text-sm sm:text-base"
            />

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="p-2 rounded bg-slate-700 outline-none text-sm sm:text-base"
            >
              <option value="global">Global</option>
              <option value="user">User Specific</option>
            </select>

            {type === "user" && (
              <input
                type="text"
                placeholder="User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="p-2 rounded bg-slate-700 outline-none text-sm sm:text-base"
              />
            )}
          </div>

          <button
            disabled={loading}
            className={`w-full py-2 rounded font-medium text-sm sm:text-base transition
              ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-emerald-500 hover:bg-emerald-600"
              }`}
          >
            {loading ? "Creating..." : "Create Coupon"}
          </button>
        </form>

        {/* ================= COUPON LIST ================= */}
        <div className="w-full lg:w-[60%] space-y-4">

          <h2 className="text-lg sm:text-xl font-semibold">
            Coupons
          </h2>

          <div className="space-y-4 max-h-[70vh] lg:max-h-[80vh] overflow-y-auto pr-1">

            {coupons.length === 0 ? (
              <p className="text-center text-gray-400 text-sm">
                No coupons yet
              </p>
            ) : (
              coupons.map((c) => {
                const isExpired = new Date(c.expiresAt) < new Date();

                return (
                  <div
                    key={c._id}
                    className="bg-slate-800 border border-slate-700 p-3 sm:p-4 rounded-lg flex flex-col gap-3 hover:border-emerald-500 transition"
                  >

                    {/* INFO */}
                    <div>
                      <p className="text-base sm:text-lg font-semibold text-emerald-400">
                        {c.code}
                      </p>

                      <p className="text-sm text-gray-300">
                        {c.discountPercentage}% OFF
                      </p>

                      <p className="text-xs text-gray-500">
                        Expires: {new Date(c.expiresAt).toLocaleDateString()}
                      </p>

                      <p className="text-xs">
                        Type:{" "}
                        <span className="text-blue-400">
                          {c.userId ? "User" : "Global"}
                        </span>
                      </p>

                      {isExpired && (
                        <span className="inline-block mt-1 text-xs bg-red-500 px-2 py-1 rounded">
                          Expired
                        </span>
                      )}

                      {!c.isActive && !isExpired && (
                        <span className="inline-block mt-1 text-xs bg-gray-500 px-2 py-1 rounded">
                          Inactive
                        </span>
                      )}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:items-center">

                      <button
                        onClick={() => toggleCoupon(c._id)}
                        className={`px-3 py-1 rounded text-sm w-full sm:w-auto
                          ${
                            c.isActive
                              ? "bg-yellow-600 hover:bg-yellow-400"
                              : "bg-gray-600 hover:bg-gray-500"
                          }`}
                      >
                        {c.isActive ? "Deactivate" : "Activate"}
                      </button>

                      <button
                        onClick={() => deleteCoupon(c._id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-400 rounded text-sm w-full sm:w-auto"
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                );
              })
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default CouponDashboard;