import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  BadgePercent,
  Boxes,
  ImageOff,
  PackageSearch,
  Search,
  Star,
  Tag,
  Trash,
} from "lucide-react";
import toast from "react-hot-toast";
import useProductStore from "../../store/productStore";

const INITIAL_PRODUCT_COUNT = 12;
const PRODUCT_BATCH_SIZE = 8;
const MotionTr = motion.tr;
const MotionDiv = motion.div;

const ProductPage = () => {
  const { products = [], deleteProduct, toggleFeatured, loading } = useProductStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [visibleCount, setVisibleCount] = useState(INITIAL_PRODUCT_COUNT);
  const loadMoreRef = useRef(null);

  const resetProductScroll = () => {
    setVisibleCount(INITIAL_PRODUCT_COUNT);
  };

  const formatCurrency = (value = 0) => `GHC ${Number(value || 0).toFixed(2)}`;

  const getProductImage = (image) =>
    image?.includes("/upload/")
      ? image.replace("/upload/", "/upload/w_300,q_auto,f_auto/")
      : image;

  const categories = useMemo(
    () =>
      [...new Set(products.map((product) => product.category).filter(Boolean))].sort(),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return products
      .filter((product) => {
        const matchesSearch =
          !normalizedSearch ||
          product.name?.toLowerCase().includes(normalizedSearch) ||
          product.category?.toLowerCase().includes(normalizedSearch);

        const matchesCategory =
          categoryFilter === "all" || product.category === categoryFilter;

        const matchesFeatured =
          featuredFilter === "all" ||
          (featuredFilter === "featured" && product.isFeatured) ||
          (featuredFilter === "regular" && !product.isFeatured);

        return matchesSearch && matchesCategory && matchesFeatured;
      })
      .sort((a, b) => {
        if (sortBy === "price-high") return (b.price || 0) - (a.price || 0);
        if (sortBy === "price-low") return (a.price || 0) - (b.price || 0);
        if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [categoryFilter, featuredFilter, products, searchTerm, sortBy]);

  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount]
  );

  const hasMoreProducts = visibleCount < filteredProducts.length;

  const loadMoreProducts = useCallback(() => {
    setVisibleCount((currentCount) =>
      Math.min(currentCount + PRODUCT_BATCH_SIZE, filteredProducts.length)
    );
  }, [filteredProducts.length]);

  useEffect(() => {
    const currentRef = loadMoreRef.current;

    if (!currentRef || !hasMoreProducts) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        loadMoreProducts();
      },
      { rootMargin: "240px 0px" }
    );

    observer.observe(currentRef);

    return () => observer.disconnect();
  }, [hasMoreProducts, loadMoreProducts, visibleCount]);

  const featuredCount = products.filter((product) => product.isFeatured).length;
  const discountedCount = products.filter(
    (product) => product.discountPercentage > 0
  ).length;
  const inventoryValue = products.reduce(
    (sum, product) => sum + Number(product.price || 0),
    0
  );

  const handleDelete = async (product) => {
    const confirmed = window.confirm(`Delete "${product.name}" permanently?`);

    if (!confirmed) return;

    await deleteProduct(product._id);
  };

  const handleToggleFeatured = async (product) => {
    await toggleFeatured(product._id);

    toast.success(
      product.isFeatured ? "Removed from featured" : "Marked as featured",
      {
        id: `featured-${product._id}`,
      }
    );
  };

  return (
    <div className="w-full space-y-4 text-white">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center justify-center gap-2 text-lg font-semibold sm:text-xl">
            <Boxes size={20} className="text-indigo-400" />
            Product Management
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Review products, feature best sellers, and remove outdated listings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
          <p className="text-sm text-slate-400">Total Products</p>
          <p className="mt-1 text-2xl font-bold">{products.length}</p>
        </div>
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
          <p className="text-sm text-slate-400">Featured</p>
          <p className="mt-1 text-2xl font-bold text-indigo-300">
            {featuredCount}
          </p>
        </div>
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
          <p className="text-sm text-slate-400">Discounted</p>
          <p className="mt-1 text-2xl font-bold">{discountedCount}</p>
        </div>
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
          <p className="text-sm text-slate-400">Catalog Value</p>
          <p className="mt-1 text-2xl font-bold">
            {formatCurrency(inventoryValue)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-lg border border-slate-700 bg-slate-800 p-4 lg:grid-cols-[1fr_auto_auto_auto]">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              resetProductScroll();
            }}
            placeholder="Search products or categories"
            className="w-full rounded-md border border-slate-700 bg-slate-900 py-2 pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            resetProductScroll();
          }}
          className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none transition focus:border-indigo-500"
        >
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={featuredFilter}
          onChange={(e) => {
            setFeaturedFilter(e.target.value);
            resetProductScroll();
          }}
          className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none transition focus:border-indigo-500"
        >
          <option value="all">All products</option>
          <option value="featured">Featured</option>
          <option value="regular">Not featured</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            resetProductScroll();
          }}
          className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none transition focus:border-indigo-500"
        >
          <option value="newest">Newest first</option>
          <option value="name">Name A-Z</option>
          <option value="price-high">Price high-low</option>
          <option value="price-low">Price low-high</option>
        </select>
      </div>

      {loading && products.length === 0 ? (
        <div className="flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800 p-8 text-sm text-slate-300">
          Loading products...
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-8 text-center text-sm text-slate-400">
          <PackageSearch className="mx-auto mb-3 text-slate-500" size={34} />
          No products found.
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-8 text-center text-sm text-slate-400">
          <PackageSearch className="mx-auto mb-3 text-slate-500" size={34} />
          No products match your filters.
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-lg border border-slate-700 md:block">
            <table className="min-w-245 divide-y divide-slate-700">
              <thead className="bg-slate-800">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-300">
                    Product
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-300">
                    Price
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-300">
                    Category
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-300">
                    Discount
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-300">
                    Sizes
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-slate-300">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-700 bg-slate-800/70">
                {visibleProducts.map((product, index) => (
                  <MotionTr
                    key={product._id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.28, delay: Math.min(index * 0.025, 0.16) }}
                    className="transition hover:bg-slate-700/70"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 overflow-hidden rounded-md bg-slate-900">
                          {product.image ? (
                            <img
                              loading="lazy"
                              className="h-full w-full object-cover"
                              src={getProductImage(product.image)}
                              alt={product.name}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-500">
                              <ImageOff size={18} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {product.name}
                          </p>
                          <p className="line-clamp-1 max-w-md text-xs text-slate-500">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-slate-200">
                      {formatCurrency(product.price)}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-300">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-600 bg-slate-900/70 px-2.5 py-1 text-xs">
                        <Tag size={13} className="text-slate-500" />
                        {product.category}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-300">
                      <span className="inline-flex items-center gap-1.5">
                        <BadgePercent size={14} className="text-slate-500" />
                        {product.discountPercentage || 0}%
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {product.sizes?.length > 0 ? (
                          product.sizes.map((size) => (
                            <span
                              key={size}
                              className="rounded bg-slate-900 px-2 py-1 text-xs text-slate-300"
                            >
                              {size}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-500">None</span>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(product)}
                          className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium transition ${
                            product.isFeatured
                              ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-200 hover:bg-indigo-500/20"
                              : "border-slate-600 bg-slate-900/70 text-slate-300 hover:border-indigo-500/40 hover:text-indigo-200"
                          }`}
                        >
                          <Star
                            size={14}
                            className={product.isFeatured ? "fill-current" : ""}
                          />
                          {product.isFeatured ? "Featured" : "Feature"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(product)}
                          className="inline-flex items-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-300 transition hover:bg-red-500/20"
                        >
                          <Trash size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </MotionTr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {visibleProducts.map((product, index) => (
              <MotionDiv
                key={product._id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.18) }}
                className="rounded-lg border border-slate-700 bg-slate-800 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-slate-900">
                    {product.image ? (
                      <img
                        loading="lazy"
                        src={getProductImage(product.image)}
                        className="h-full w-full object-cover"
                        alt={product.name}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-500">
                        <ImageOff size={20} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {product.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {product.category}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-indigo-200">
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-md bg-slate-900/70 p-3">
                    <p className="text-slate-500">Discount</p>
                    <p className="mt-1 font-semibold text-slate-200">
                      {product.discountPercentage || 0}%
                    </p>
                  </div>
                  <div className="rounded-md bg-slate-900/70 p-3">
                    <p className="text-slate-500">Featured</p>
                    <p className="mt-1 font-semibold text-slate-200">
                      {product.isFeatured ? "Yes" : "No"}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(product)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition ${
                      product.isFeatured
                        ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-200"
                        : "border-slate-600 bg-slate-900/70 text-slate-300"
                    }`}
                  >
                    <Star
                      size={16}
                      className={product.isFeatured ? "fill-current" : ""}
                    />
                    {product.isFeatured ? "Featured" : "Feature"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(product)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-300"
                  >
                    <Trash size={16} />
                    Delete
                  </button>
                </div>
              </MotionDiv>
            ))}
          </div>

          <div
            ref={loadMoreRef}
            className="flex min-h-12 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/60 p-3 text-sm text-slate-400"
          >
            {hasMoreProducts ? (
              <button
                type="button"
                onClick={loadMoreProducts}
                className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-indigo-200 transition hover:bg-indigo-500/20"
              >
                Load more products
              </button>
            ) : (
              <span>
                Showing {visibleProducts.length} of {filteredProducts.length} products
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductPage;
