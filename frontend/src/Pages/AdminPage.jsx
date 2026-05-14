import { BarChart, GiftIcon, PlusCircleIcon, ShoppingCartIcon } from "lucide-react";
import { useEffect, useState } from "react";
import CreatePage from "../Components/CreatePage.jsx";
import ProductPage from "../Components/ProductPage.jsx";
import AnalyticPage from "../Components/AnalyticPage.jsx";
import CouponPage from "../Components/CouponPage.jsx";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import useProductStore from "../store/productStore.js";

const AdminPage = () => {
  const { fetchAllProducts } = useProductStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  const tabs = [
    { id: "create", label: "Create", icon: PlusCircleIcon },
    { id: "products", label: "Products", icon: ShoppingCartIcon },
    { id: "analytics", label: "Analytics", icon: BarChart },
    { id: "coupon", label: "Coupons", icon: GiftIcon },
  ];

  const [activeTab, setActiveTab] = useState("create");

  return (
    <div className="min-h-screen bg-slate-900 text-white px-3 sm:px-6 lg:px-10 py-3">

      {/* TITLE */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-md sm:text-2xl font-semibold mb-3"
      >
        Admin Dashboard
      </motion.h1>

      {/* TABS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6"
      >
        <div className="flex gap-2 overflow-x-auto pb-2 sm:justify-center no-scrollbar">

          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-lg border transition
                  ${
                    activeTab === tab.id
                      ? "bg-indigo-600 border-indigo-500 text-white"
                      : "border-slate-700 text-gray-300 hover:border-indigo-400"
                  }
                `}
              >
                <Icon size={16} />
                <span className="text-sm">{tab.label}</span>
              </button>
            );
          })}

        </div>
      </motion.div>

      {/* CONTENT */}
      <div className="w-full">
        {activeTab === "create" && <CreatePage />}
        {activeTab === "products" && <ProductPage />}
        {activeTab === "analytics" && <AnalyticPage />}
        {activeTab === "coupon" && <CouponPage />}
      </div>
    </div>
  );
};

export default AdminPage;