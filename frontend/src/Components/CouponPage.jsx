import { useEffect, useState } from "react";
import cartStore from "../store/cartStore";
import api from "../api/axios";
import toast from "react-hot-toast";
import { Loader, Ticket } from "lucide-react";

const CouponDashboard = () => {
  const {
    coupons,
    getAllCoupons,
    toggleCoupon,
    deleteCoupon,
  } = cartStore();

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
      return toast.error("Fill all required fields", {
        duration: 3000,
        id: "required-fields-error",
      });
    }

    if (discount <= 0 || discount > 100) {
      return toast.error(
        "Discount must be between 1 and 100",
        {
          duration: 3000,
          id: "discount-error",
        }
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(expiry);

    if (selectedDate <= today) {
      return toast.error(
        "Expiry must be in the future",
        {
          duration: 3000,
          id: "expiry-error",
        }
      );
    }

    if (type === "user" && !userId) {
      return toast.error("User ID required", {
        duration: 3000,
        id: "user-id-error",
      });
    }

    try {
      setLoading(true);

      await api.post("/coupon/admin/create", {
        code,
        discountPercentage: Number(discount),
        expiresAt: expiry,
        userId: type === "user" ? userId : null,
      });

      toast.success("Coupon created", {
        duration: 3000,
        id: "create-success",
      });

      setCode("");
      setDiscount("");
      setExpiry("");
      setUserId("");
      setType("global");

      await getAllCoupons();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Create failed",
        {
          duration: 3000,
          id: "create-failed",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this coupon permanently?"
    );

    if (!confirmed) return;

    await deleteCoupon(id);
  };

  return (
    <div className="min-h-screen text-white p-3 sm:p-6">

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">

        {/* ================= FORM ================= */}
        <form
          onSubmit={handleCreate}
          className="
            w-full lg:w-[40%]
            bg-slate-800
            border border-slate-700
            p-4 sm:p-6
            rounded-2xl
            space-y-4
            h-fit
            shadow-lg
          "
        >
          <h2 className="text-lg sm:text-xl font-semibold text-emerald-400">
            Create Coupon
          </h2>

          <div className="flex flex-col gap-3">

            {/* COUPON CODE */}
            <input
              type="text"
              placeholder="Coupon Code"
              value={code}
              onChange={(e) =>
                setCode(
                  e.target.value
                    .toUpperCase()
                    .replace(/\s+/g, "")
                )
              }
              className="
                p-3 rounded-lg
                bg-slate-700
                border border-slate-600
                outline-none
                focus:border-indigo-500
                text-sm sm:text-base
              "
            />

            {/* DISCOUNT */}
            <input
              type="number"
              min="1"
              max="100"
              placeholder="Discount %"
              value={discount}
              onChange={(e) =>
                setDiscount(e.target.value)
              }
              className="
                p-3 rounded-lg
                bg-slate-700
                border border-slate-600
                outline-none
                focus:border-indigo-500
                text-sm sm:text-base
              "
            />

            {/* EXPIRY */}
            <input
              type="date"
              value={expiry}
              onChange={(e) =>
                setExpiry(e.target.value)
              }
              className="
                p-3 rounded-lg
                bg-slate-700
                border border-slate-600
                outline-none
                focus:border-indigo-500
                text-sm sm:text-base
              "
            />

            {/* TYPE */}
            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value)
              }
              className="
                p-3 rounded-lg
                bg-slate-700
                border border-slate-600
                outline-none
                focus:border-indigo-500
                text-sm sm:text-base
              "
            >
              <option value="global">
                Global
              </option>

              <option value="user">
                User Specific
              </option>
            </select>

            {/* USER ID */}
            {type === "user" && (
              <input
                type="text"
                placeholder="User ID"
                value={userId}
                onChange={(e) =>
                  setUserId(e.target.value)
                }
                className="
                  p-3 rounded-lg
                  bg-slate-700
                  border border-slate-600
                  outline-none
                  focus:border-indigo-500
                  text-sm sm:text-base
                "
              />
            )}

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`
              w-full py-3 rounded-lg
              font-medium
              text-sm sm:text-base
              transition-all duration-200
              flex items-center justify-center gap-2
              ${
                loading
                  ? `
                    bg-gray-500
                    cursor-not-allowed
                  `
                  : `
                    bg-indigo-600
                    hover:bg-indigo-500
                    hover:scale-[1.01]
                  `
              }
            `}
          >
            {loading ? (
              <>
                <Loader className="animate-spin" />
                Creating...
              </>
            ) : (
              "Create Coupon"
            )}
          </button>

        </form>

        {/* ================= RIGHT SIDE ================= */}
        <div className="w-full lg:w-[60%] space-y-4">

          {/* TITLE */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold">
              Coupons
            </h2>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-3 gap-3">

            <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl">
              <p className="text-xs text-gray-400">
                Total
              </p>

              <h3 className="text-2xl font-bold mt-1">
                {coupons.length}
              </h3>
            </div>

            <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl">
              <p className="text-xs text-gray-400">
                Active
              </p>

              <h3 className="text-2xl font-bold text-indigo-400 mt-1">
                {
                  coupons.filter(
                    (c) => c.isActive
                  ).length
                }
              </h3>
            </div>

            <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl">
              <p className="text-xs text-gray-400">
                Expired
              </p>

              <h3 className="text-2xl font-bold text-red-400 mt-1">
                {
                  coupons.filter(
                    (c) =>
                      new Date(c.expiresAt) <
                      new Date()
                  ).length
                }
              </h3>
            </div>

          </div>

          {/* COUPONS */}
          <div className="space-y-4 max-h-[70vh] lg:max-h-[80vh] overflow-y-auto pr-1">

            {coupons.length === 0 ? (

              <div className="text-center py-14 text-gray-400">
                <Ticket
                  size={42}
                  className="mx-auto mb-3 opacity-50"
                />

                <p>No coupons yet</p>
              </div>

            ) : (

              coupons.map((c) => {
                const isExpired =
                  new Date(c.expiresAt) <
                  new Date();

                return (
                  <div
                    key={c._id}
                    className={`
                      p-4 rounded-2xl
                      border
                      transition-all duration-200
                      ${
                        isExpired
                          ? `
                            bg-slate-800/70
                            border-red-500/30
                            opacity-70
                          `
                          : `
                            bg-slate-800
                            border-slate-700
                            hover:border-indigo-500
                          `
                      }
                    `}
                  >

                    {/* INFO */}
                    <div className="space-y-1">

                      <div className="flex items-center justify-between gap-2">

                        <p className="text-lg font-semibold text-indigo-400 break-all">
                          {c.code}
                        </p>

                        {isExpired && (
                          <span className="text-xs bg-red-500 px-2 py-1 rounded">
                            Expired
                          </span>
                        )}

                        {!c.isActive &&
                          !isExpired && (
                            <span className="text-xs bg-gray-500 px-2 py-1 rounded">
                              Inactive
                            </span>
                          )}

                      </div>

                      <p className="text-sm text-gray-300">
                        {c.discountPercentage}% OFF
                      </p>

                      <p className="text-xs text-gray-500">
                        Expires:{" "}
                        {new Date(
                          c.expiresAt
                        ).toLocaleDateString()}
                      </p>

                      <p className="text-xs">
                        Type:{" "}
                        <span className="text-blue-400">
                          {c.userId
                            ? "User"
                            : "Global"}
                        </span>
                      </p>

                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:items-center mt-4">

                      <button
                        type="button"
                        onClick={() =>
                          toggleCoupon(c._id)
                        }
                        className={`
                          px-4 py-2 rounded-lg
                          text-sm
                          transition
                          w-full sm:w-auto
                          ${
                            c.isActive
                              ? `
                                bg-yellow-600
                                hover:bg-yellow-500
                              `
                              : `
                                bg-gray-600
                                hover:bg-gray-500
                              `
                          }
                        `}
                      >
                        {c.isActive
                          ? "Deactivate"
                          : "Activate"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(c._id)
                        }
                        className="
                          px-4 py-2
                          bg-red-600
                          hover:bg-red-500
                          rounded-lg
                          text-sm
                          transition
                          w-full sm:w-auto
                        "
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