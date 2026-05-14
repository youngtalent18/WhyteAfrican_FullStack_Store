import { useEffect } from "react";
import cartStore from "../store/cartStore";
import FloatingContact from "../Components/ContactUs.jsx";

const OrdersPage = () => {
  const { orders, getOrders } = cartStore();

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
      <FloatingContact />

      {/* HEADER */}
      <div className="max-w-5xl mx-auto mb-8 text-center">
        <h1 className="text-xl sm:text-3xl font-semibold tracking-tight">
          My Orders
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Track your purchases and order history
        </p>
      </div>

      {/* EMPTY STATE */}
      {orders.length === 0 ? (
        <div className="text-center text-slate-400 mt-24">
          <p className="text-base sm:text-lg">No orders yet</p>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto space-y-6">

          {orders.map((order) => (
            <div
              key={order._id}
              className="
                bg-linear-to-b from-slate-900 to-slate-950
                border border-slate-800/70
                rounded-2xl
                shadow-lg shadow-black/30
                overflow-hidden
              "
            >

              {/* TOP SECTION */}
              <div className="p-4 sm:p-6 border-b border-slate-800/70 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

                {/* LEFT */}
                <div className="min-w-0">
                  <p className="text-[11px] text-slate-500 uppercase tracking-wide">
                    Order Reference
                  </p>
                  <p className="text-sm text-slate-200 break-all mt-1">
                    {order.paymentReference}
                  </p>
                </div>

                {/* RIGHT */}
                <div className="text-left sm:text-right space-y-2">

                  {/* STATUS BADGE */}
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 ring-1 ring-green-500/20">
                    {order.status}
                  </span>

                  <p className="text-base font-semibold text-white">
                    GHC {order.totalAmount?.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* SUMMARY */}
              <div className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-slate-400 space-y-1 border-b border-slate-800/60">

                {order.subtotal && (
                  <p>
                    Subtotal: <span className="text-slate-200">GHC {order.subtotal}</span>
                  </p>
                )}

                {order.discountPercentage > 0 && (
                  <p>
                    Discount:{" "}
                    <span className="text-green-400">
                      {order.discountPercentage}% (-GHC {order.discountAmount})
                    </span>
                  </p>
                )}

                {order.couponCode && (
                  <p>
                    Coupon: <span className="text-slate-200">{order.couponCode}</span>
                  </p>
                )}
              </div>

              {/* ITEMS */}
              <div className="p-4 sm:p-6 space-y-4">

                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="
                      flex items-center gap-4
                      p-2 rounded-lg
                      hover:bg-slate-800/30
                      transition
                    "
                  >

                    {/* IMAGE */}
                    <img
                      src={item.product?.image?.replace(
                        "/upload/",
                        "/upload/w_200,q_auto,f_auto/"
                      )}
                      alt={item.name}
                      className="
                        w-12 h-12 sm:w-14 sm:h-14
                        object-cover
                        rounded-lg
                        border border-slate-700
                      "
                    />

                    {/* INFO */}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-slate-200 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Quantity: {item.quantity}
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
  );
};

export default OrdersPage;