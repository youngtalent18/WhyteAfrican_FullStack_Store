import { useEffect } from "react";
import cartStore from "../store/cartStore";
import FloatingContact from "../Components/ContactUs.jsx";

const OrdersPage = () => {
  const { orders, getOrders } = cartStore();

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  return (
    <div className="bg-slate-900 text-white px-3 sm:px-6 lg:px-10 py-4 sm:py-10">
      <FloatingContact />

      {/* HEADER */}
      <div className="max-w-5xl mx-auto mb-6 sm:mb-10 text-center">
        <h1 className="text-md sm:text-2xl md:text-3xl font-bold">
          My Orders
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">
          Track your purchases and order history
        </p>
      </div>

      {/* EMPTY STATE */}
      {orders.length === 0 ? (
        <div className="text-center text-gray-400 mt-16 sm:mt-24">
          <p className="text-base sm:text-lg">No orders yet</p>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto space-y-2 sm:space-y-4">

          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-slate-800 border border-slate-700 rounded-lg sm:rounded-xl p-3 sm:p-5 shadow-md"
            >

              {/* ORDER HEADER */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-[10px] sm:text-xs text-gray-400">
                    Order Reference
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-gray-200 break-all">
                    {order.paymentReference}
                  </p>
                </div>

                {/* STATUS + TOTAL */}
                <div className="text-right">
                  <p className="text-xs text-gray-400">
                    Status: <span className="text-green-400">{order.status}</span>
                  </p>

                  <p className="text-sm font-semibold text-white mt-1">
                    Total Paid: GHC {order.totalAmount?.toFixed(2)}
                  </p>
                </div>

              </div>

              {/* 💰 DISCOUNT INFO */}
              <div className="mt-3 text-xs text-gray-400 space-y-1 border-t border-slate-700 pt-3">

                {order.subtotal && (
                  <p>Subtotal: GHC {order.subtotal}</p>
                )}

                {order.discountPercentage > 0 && (
                  <p>
                    Discount: {order.discountPercentage}% (-GHC{" "}
                    {order.discountAmount})
                  </p>
                )}

                {order.couponCode && (
                  <p>Coupon: {order.couponCode}</p>
                )}

              </div>

              {/* ITEMS */}
              <div className="mt-3 sm:mt-5 space-y-3 pt-3">

                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-3 sm:gap-4"
                  >

                    {/* IMAGE */}
                    <img
                      src={item.product?.image?.replace(
                        "/upload/",
                        "/upload/w_200,q_auto,f_auto/"
                      )}
                      alt={item.name}
                      className="w-10 h-10 sm:w-14 sm:h-14 object-cover rounded-md sm:rounded-lg border border-slate-700 shrink-0"
                    />

                    {/* NAME + QTY */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-200 truncate">
                        {item.name}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-400">
                        Qty: {item.quantity}
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