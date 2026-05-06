import React, { useState } from "react";
import { Filter } from "lucide-react";

const Sort = ({ setSortOption, setCategory, products }) => {
  const productLength = products.length;
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    "Men",
    "Women",
    "Kids",
    "Perfumes",
    "Shoes",
    "Bags",
    "Jackets",
    "Caps",
  ];

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    setCategory(cat === "All" ? "All" : cat.toLowerCase());
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-6">
      
      <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-lg p-4 sm:p-5 space-y-4">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          {/* LEFT TITLE */}
          <div className="flex items-center gap-2 text-white font-medium">
            <Filter size={18} />
            <span className="text-sm sm:text-base">Sort & Filter</span>
          </div>

          {/* PRODUCT COUNT + SORT */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">

            <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-slate-700 border border-slate-600 text-xs sm:text-sm text-gray-200">
              {productLength} Products
            </span>

            <select
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full sm:w-auto bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 cursor-pointer text-sm"
            >
              <option>Popularity</option>
              <option value="name">Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

          </div>
        </div>

        {/* CATEGORY SCROLL (IMPORTANT FIX) */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">

          {categories.map((item, i) => (
            <button
              key={i}
              onClick={() => handleCategory(item)}
              className={`
                whitespace-nowrap px-3 py-1.5 text-xs sm:text-sm rounded-full border transition
                ${
                  activeCategory === item
                    ? "bg-white text-black border-white"
                    : "border-slate-600 text-gray-200 hover:bg-slate-700"
                }
              `}
            >
              {item}
            </button>
          ))}

        </div>

      </div>
    </section>
  );
};

export default Sort;