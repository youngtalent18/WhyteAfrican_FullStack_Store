// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Loader,
  PlusCircle,
  Upload,
  Package2,
  BadgePercent,
  Tag,
} from "lucide-react";
import toast from "react-hot-toast";
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

  if (!newProduct.category) {
    return toast.error("Please select a category");
  }

  if (Number(newProduct.price) <= 0) {
    return toast.error("Price must be greater than 0");
  }

  if (
    newProduct.discountPercentage < 0 ||
    newProduct.discountPercentage > 100
  ) {
    return toast.error("Discount must be between 0 and 100");
  }

  if (newProduct.sizes.length === 0) {
    return toast.error("Select at least one size");
  }

  if (!newProduct.image) {
    return toast.error("Upload a product image");
  }

  await createProducts({
    ...newProduct,
    price: Number(newProduct.price),
    discountPercentage: Number(
      newProduct.discountPercentage || 0
    ),
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

  if (file.size > 2 * 1024 * 1024) {
    return toast.error("Image must be less than 2MB");
  }

  const reader = new FileReader();

  reader.onloadend = () => {
    setNewProduct((prev) => ({
      ...prev,
      image: reader.result,
    }));
  };

  reader.readAsDataURL(file);
};

  return (
    <div className="relative min-h-screen px-3 sm:px-6 py-6 overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-125 h-125 bg-emerald-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="
          w-full max-w-2xl mx-auto
          rounded-4xl
          border border-white/10
          bg-slate-900/80
          backdrop-blur-2xl
          shadow-[0_10px_60px_rgba(0,0,0,0.55)]
          overflow-hidden
        "
      >

        {/* TOP HEADER */}
        <div className="relative border-b border-white/10 p-6 sm:p-8">

          <div className="absolute inset-0 bg-linear-to-r from-emerald-500/10 via-transparent to-transparent" />

          <div className="relative flex items-center gap-4">
            <div
              className="
                w-14 h-14 rounded-2xl
                bg-indigo-500/15
                border border-indigo-500/20
                flex items-center justify-center
                text-indigo-400
              "
            >
              <Package2 size={28} />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Create Product
              </h2>

              <p className="text-slate-400 text-sm mt-1">
                Add a premium product to your store
              </p>
            </div>
          </div>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="p-5 sm:p-8 space-y-6"
        >

          {/* PRODUCT NAME */}
          <div className="space-y-2">
            <label className="text-sm text-slate-300 font-medium">
              Product Name
            </label>

            <input
              type="text"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  name: e.target.value,
                })
              }
              placeholder="Enter product name"
              className="
                w-full
                rounded-2xl
                border border-white/10
                bg-slate-950/80
                px-4 py-3
                text-white
                placeholder:text-slate-500
                outline-none
                focus:border-indigo-500/40
                focus:ring-4 focus:ring-indigo-500/10
                transition-all
              "
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <label className="text-sm text-slate-300 font-medium">
              Description
            </label>

            <textarea
              rows={5}
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  description: e.target.value,
                })
              }
              placeholder="Write product description..."
              className="
                w-full
                rounded-2xl
                border border-white/10
                bg-slate-950/80
                px-4 py-3
                text-white
                placeholder:text-slate-500
                outline-none
                resize-none
                focus:border-indigo-500/40
                focus:ring-4 focus:ring-indigo-500/10
                transition-all
              "
              required
            />
          </div>

          {/* PRICE + CATEGORY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* PRICE */}
            <div className="space-y-2">
              <label className="text-sm text-slate-300 font-medium flex items-center gap-2">
                <BadgePercent size={16} />
                Price
              </label>

              <input
                type="number"
                min={0}
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    price: e.target.value,
                  })
                }
                placeholder="0.00"
                className="
                  w-full
                  rounded-2xl
                  border border-white/10
                  bg-slate-950/80
                  px-4 py-3
                  text-white
                  placeholder:text-slate-500
                  outline-none
                  focus:border-indigo-500/40
                  focus:ring-4 focus:ring-indigo-500/10
                  transition-all
                "
                required
              />
            </div>

            {/* CATEGORY */}
            <div className="space-y-2">
              <label className="text-sm text-slate-300 font-medium flex items-center gap-2">
                <Tag size={16} />
                Category
              </label>

              <select
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    category: e.target.value,
                  })
                }
                className="
                  w-full
                  rounded-2xl
                  border border-white/10
                  bg-slate-950/80
                  px-4 py-3
                  text-white
                  outline-none
                  focus:border-indigo-500/40
                  focus:ring-4 focus:ring-indigo-500/10
                  transition-all
                "
              >
                <option value="">Select category</option>

                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* SIZES */}
          <div className="space-y-3">
            <label className="text-sm text-slate-300 font-medium">
              Available Sizes
            </label>

            <div className="flex flex-wrap gap-3">
              {["S", "M", "L", "XL"].map((size) => (
                <button
                  type="button"
                  key={size}
                  onClick={() => {
                    setNewProduct((prev) => {
                      const exists =
                        prev.sizes.includes(size);

                      return {
                        ...prev,
                        sizes: exists
                          ? prev.sizes.filter(
                              (s) => s !== size
                            )
                          : [...prev.sizes, size],
                      };
                    });
                  }}
                  className={`
                    min-w-15
                    px-4 py-2.5
                    rounded-2xl
                    border
                    font-medium
                    transition-all duration-200
                    ${
                      newProduct.sizes.includes(size)
                        ? `
                          bg-indigo-500
                          border-indigo-400
                          text-white
                          shadow-lg shadow-indigo-500/20
                        `
                        : `
                          border-white/10
                          bg-slate-950/70
                          text-slate-300
                          hover:bg-slate-800
                          hover:border-white/20
                        `
                    }
                  `}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* DISCOUNT */}
          <div className="space-y-2">
            <label className="text-sm text-slate-300 font-medium">
              Discount Percentage
            </label>

            <input
              type="number"
              min={0}
              max={100}
              value={newProduct.discountPercentage}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  discountPercentage: Number(
                    e.target.value
                  ),
                })
              }
              placeholder="0"
              className="
                w-full
                rounded-2xl
                border border-white/10
                bg-slate-950/80
                px-4 py-3
                text-white
                placeholder:text-slate-500
                outline-none
                focus:border-indigo-500/40
                focus:ring-4 focus:ring-indigo-500/10
                transition-all
              "
              required
            />
          </div>

          {/* IMAGE */}
          <div className="space-y-3">

            <label className="text-sm text-slate-300 font-medium">
              Product Image
            </label>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">

              <label
                className="
                  group
                  relative
                  overflow-hidden
                  flex items-center justify-center gap-2
                  rounded-2xl
                  border border-indigo-500/20
                  bg-indigo-500
                  hover:bg-indigo-400
                  text-white
                  font-medium
                  px-5 py-3
                  cursor-pointer
                  transition-all duration-200
                  shadow-lg shadow-indigo-500/20
                  hover:shadow-indigo-500/40
                "
              >
                <Upload size={18} />

                Upload Image

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleOnchange}
                  className="hidden"
                />
              </label>

              {newProduct.image && (
                <div
                  className="
                    relative
                    w-20 h-20
                    rounded-2xl
                    overflow-hidden
                    border border-white/10
                    bg-slate-950
                  "
                >
                  <img
                    src={newProduct.image}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            disabled={loading}
            className={`
              w-full
              rounded-2xl
              py-4
              flex items-center justify-center gap-3
              font-semibold
              text-white
              transition-all duration-200
              ${
                loading
                  ? `
                    bg-slate-700
                    cursor-not-allowed
                  `
                  : `
                    bg-indigo-500
                    hover:bg-indigo-400
                    shadow-lg shadow-indigo-500/20
                    hover:shadow-indigo-500/40
                    hover:-translate-y-0.5
                  `
              }
            `}
          >
            {loading ? (
              <>
                <Loader
                  className="animate-spin"
                  size={18}
                />
                Creating Product...
              </>
            ) : (
              <>
                <PlusCircle size={18} />
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