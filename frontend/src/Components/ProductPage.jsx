// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Star, Trash } from "lucide-react";
import useProductStore from "../store/productStore";

const ProductPage = () => {
  const { products, deleteProduct, toggleFeatured } = useProductStore();

  return (
    <div className="w-full">

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block">
        <motion.table
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="min-w-full divide-y divide-gray-700"
        >
          <thead className="bg-gray-800">
            <tr>
              <th className="px-5 py-3 text-left text-xs text-gray-300 uppercase">
                Product
              </th>
              <th className="px-5 py-3 text-left text-xs text-gray-300 uppercase">
                Price
              </th>
              <th className="px-5 py-3 text-left text-xs text-gray-300 uppercase">
                Category
              </th>
              <th className="px-5 py-3 text-left text-xs text-gray-300 uppercase">
                Featured
              </th>
              <th className="px-5 py-3 text-left text-xs text-gray-300 uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {products?.map((product) => (
              <tr key={product._id} className="hover:bg-gray-700 transition">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      loading="lazy"
                      className="h-10 w-10 rounded-full object-cover"
                      src={product.image.replace(
                        "/upload/",
                        "/upload/w_300,q_auto,f_auto/"
                      )}
                      alt={product.name}
                    />
                    <p className="text-white text-sm font-medium">
                      {product.name}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-3 text-white">
                  GHC {product.price.toFixed(2)}
                </td>

                <td className="px-6 py-3 text-white">
                  {product.category}
                </td>

                <td className="px-6 py-3">
                  <button
                    onClick={() => toggleFeatured(product._id)}
                    className={`p-2 rounded-full ${
                      product.isFeatured
                        ? "bg-yellow-400 text-white"
                        : "bg-gray-600 text-gray-300"
                    }`}
                  >
                    <Star size={16} />
                  </button>
                </td>

                <td className="px-6 py-3">
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="p-2 bg-white rounded-full"
                  >
                    <Trash color="red" size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </motion.table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-4">
        {products?.map((product) => (
          <div
            key={product._id}
            className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow"
          >
            <div className="flex gap-3 items-center">
              <img
                loading="lazy"
                src={product.image.replace(
                  "/upload/",
                  "/upload/w_300,q_auto,f_auto/"
                )}
                className="h-14 w-14 rounded-lg object-cover"
                alt={product.name}
              />

              <div className="flex-1">
                <p className="text-white font-medium text-sm">
                  {product.name}
                </p>
                <p className="text-gray-400 text-xs">
                  {product.category}
                </p>
                <p className="text-indigo-400-400 text-sm font-semibold mt-1">
                  GHC {product.price.toFixed(2)}
                </p>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => toggleFeatured(product._id)}
                className={`p-2 rounded-full ${
                  product.isFeatured
                    ? "bg-yellow-400 text-white"
                    : "bg-gray-600 text-gray-300"
                }`}
              >
                <Star size={16} />
              </button>

              <button
                onClick={() => deleteProduct(product._id)}
                className="p-2 bg-white rounded-full"
              >
                <Trash color="red" size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ProductPage;