// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useState } from "react";
import { Loader, PlusCircle, Upload } from "lucide-react";
import useProductStore from "../store/productStore.js";

const CreatePage = () => {
  const { loading, createProducts } = useProductStore();

  const categories = [
    "men",
    "women",
    "kids",
    "perfumes",
    "bags",
    "shoes",
    "jackets",
    "caps",
  ];

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    sizes: [],
    discountPercentage: 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createProducts({
      ...newProduct,
      price: Number(newProduct.price),
      discountPercentage: Number(newProduct.discountPercentage || 0),
    });

    setNewProduct({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      sizes: [],
      discountPercentage: 0,
    });
  };

  const handleOnchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewProduct((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="px-3 sm:px-6 lg:px-0">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6 lg:p-8"
      >
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-5">
          Create Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* NAME */}
          <input
            type="text"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            placeholder="Product name"
            className="w-full px-3 py-2.5 rounded-md bg-slate-900 border border-slate-700 text-white text-sm"
            required
          />

          {/* DESCRIPTION */}
          <textarea
            rows={4}
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            placeholder="Description"
            className="w-full px-3 py-2.5 rounded-md bg-slate-900 border border-slate-700 text-white text-sm resize-none"
            required
          />

          {/* PRICE + CATEGORY (STACK ON MOBILE, SIDE BY SIDE ON DESKTOP) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            <input
              type="number"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
              placeholder="Price"
              className="w-full px-3 py-2.5 rounded-md bg-slate-900 border border-slate-700 text-white text-sm"
              required
            />

            <select
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
              className="w-full px-3 py-2.5 rounded-md bg-slate-900 border border-slate-700 text-white text-sm"
            >
              <option value="">Category</option>
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>

          </div>

          {/* SIZES */}
          <div>
            <p className="text-sm text-gray-400 mb-2">Sizes</p>

            <div className="flex flex-wrap gap-2">
              {["S", "M", "L", "XL"].map((size) => (
                <button
                  type="button"
                  key={size}
                  onClick={() => {
                    setNewProduct((prev) => {
                      const exists = prev.sizes.includes(size);
                      return {
                        ...prev,
                        sizes: exists
                          ? prev.sizes.filter((s) => s !== size)
                          : [...prev.sizes, size],
                      };
                    });
                  }}
                  className={`px-3 py-1.5 text-sm rounded-md border transition
                    ${
                      newProduct.sizes.includes(size)
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "border-slate-600 text-gray-300"
                    }
                  `}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* DISCOUNT */}
          <div>
            <label htmlFor="discount" className="text-sm text-gray-400">
              Discount (%)
            </label>
            <input
              type="number"
              id="discount"
              value={newProduct.discountPercentage}
              onChange={(e) =>
                setNewProduct({ ...newProduct, discountPercentage: Number(e.target.value) })
              }
              placeholder="Discount"
              className="w-full px-3 py-2.5 rounded-md bg-slate-900 border border-slate-700 text-white text-sm"
              required
            />
          </div>

          {/* IMAGE UPLOAD */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">

            <label className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-md cursor-pointer text-sm w-full sm:w-auto">
              <Upload size={16} />
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleOnchange}
                className="hidden"
              />
            </label>

            {newProduct.image && (
              <img
                src={newProduct.image}
                className="h-14 w-14 rounded-md object-cover border border-slate-700"
              />
            )}
          </div>

          {/* SUBMIT */}
          <button
            disabled={loading}
            className={`w-full py-2.5 rounded-md flex items-center justify-center gap-2 text-sm font-medium transition
              ${
                loading
                  ? "bg-slate-600 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-500"
              }
            `}
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={16} />
                Creating...
              </>
            ) : (
              <>
                <PlusCircle size={16} />
                Create Product
              </>
            )}
          </button>

        </form>
      </motion.div>
    </div>
  );
};

export default CreatePage;