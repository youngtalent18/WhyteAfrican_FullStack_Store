import { create } from "zustand";
import { toast } from "react-hot-toast";
import api from "../api/axios.js";

export const useProductStore = create((set) => ({
  // =====================
  // STATE
  // =====================
  products: [],
  featuredProducts: [],
  recommendedProducts: [],
  categoryProducts: [],

  loading: false,
  error: null,

  // =====================
  // ALL PRODUCTS
  // =====================
  fetchAllProducts: async () => {
    set({ loading: true, error: null });

    try {
      const res = await api.get("/products");

      set({
        products: res.data,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error: "Failed to fetch products",
      });

      console.log(error.response?.data?.message);
    }
  },

  // =====================
  // CREATE PRODUCT
  // =====================
  createProducts: async (newProduct) => {
    set({ loading: true, error: null });

    try {
      const res = await api.post("/products/create", newProduct);

      set((state) => ({
        products: [res.data, ...state.products],
        loading: false,
      }));

      toast.success("Product created successfully");
    } catch (error) {
      set({ loading: false });

      toast.error(
        error.response?.data?.message ||
          "Failed to create product"
      );
    }
  },

  // =====================
  // DELETE PRODUCT
  // =====================
  deleteProduct: async (id) => {
    try {
      await api.delete(`/products/${id}`);

      set((state) => ({
        products: state.products.filter(
          (p) => p._id !== id
        ),
      }));

      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          "Failed to delete product"
      );
    }
  },

  // =====================
  // CATEGORY PRODUCTS
  // =====================
  getCategoryProducts: async (categoryId) => {
    set({ loading: true, error: null });

    try {
      const res = await api.get(
        `/products/category/${categoryId}`
      );

      set({
        categoryProducts: res.data,
        loading: false,
      });
    } catch (error) {
      set({ loading: false });

      console.log(
        error.response?.data?.error ||
          "Failed to fetch categories"
      );
    }
  },

  // =====================
  // FEATURED PRODUCTS (FIXED)
  // =====================
  getFeaturedProducts: async () => {
    set({ loading: true, error: null });

    try {
      const res = await api.get("/products/featured");

      set({
        featuredProducts: res.data, // ✅ FIXED (NO OVERWRITE)
        loading: false,
      });
    } catch (error) {
      set({ loading: false });

      console.log(
        error.response?.data?.error ||
          "Failed to fetch featured products"
      );
    }
  },

  // =====================
  // RECOMMENDATIONS
  // =====================
  getRecommendations: async () => {
    set({ loading: true, error: null });

    try {
      const res = await api.get(
        "/products/recommendations"
      );

      set({
        recommendedProducts: res.data,
        loading: false,
      });
    } catch (error) {
      set({ loading: false });

      console.log(
        error.response?.data?.error ||
          "Failed to fetch recommendations"
      );
    }
  },

  // =====================
  // TOGGLE FEATURED
  // =====================
  toggleFeatured: async (id) => {
    set({ loading: true });

    try {
      const res = await api.patch(
        `/products/${id}/featured`
      );

      set((state) => ({
        products: state.products.map((p) =>
          p._id === id
            ? { ...p, isFeatured: res.data.isFeatured }
            : p
        ),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });

      toast.error(
        error.response?.data?.error ||
          "Failed to update product"
      );
    }
  },
}));

export default useProductStore;