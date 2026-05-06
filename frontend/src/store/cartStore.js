import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-hot-toast";
import api from "../api/axios.js";

const cartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      coupon: null,
      subtotal: 0,
      total: 0,
      discount: 0,
      loading: false,
      orders: [],
      coupons: [],
      user: null,

      // ================= AUTH SYNC =================
      setUser: async (user) => {
        set({ user });
        if (user?._id) {
          await get().syncCartWithServer();
        }
      },

      // ================= ADMIN =================
      getAllCoupons: async () => {
        try {
          const res = await api.get("/coupon/admin");
          set({ coupons: res.data });
        } catch (error) {
          console.log("Failed to fetch coupons", error);
        }
      },

      toggleCoupon: async (id) => {
        try {
          await api.patch(`/coupon/admin/toggle/${id}`);
          get().getAllCoupons();
        } catch (error) {
          console.log("Toggle failed", error);
        }
      },

      deleteCoupon: async (id) => {
        try {
          await api.delete(`/coupon/admin/${id}`);
          get().getAllCoupons();
        } catch (error) {
          console.log("Delete failed", error);
        }
      },

      // ================= ORDERS =================
      getOrders: async () => {
        try {
          const res = await api.get("/payment/orders");
          set({ orders: res.data });
        } catch (error) {
          console.log("Failed to fetch orders", error);
        }
      },

      // ================= COUPON =================
      getCoupon: async () => {
        try {
          const res = await api.get("/coupon");
          set({ coupon: res.data });
          get().syncTotals();
        } catch (error) {
          set({ coupon: null });
          console.log("Failed to fetch coupon", error);
        }
      },

      applyCoupon: async (code) => {
        try {
          set({ loading: true });

          const res = await api.post("/coupon/validate", { code });

          if (!res.data?.discountPercentage) {
            throw new Error("Invalid coupon");
          }

          set({ coupon: res.data });
          get().syncTotals();

          toast.success("Coupon applied", { id: "coupon-applied" });
        } catch (error) {
          toast.error(error.response?.data?.message || "Invalid coupon", { id: "invalid-coupon" });
        } finally {
          set({ loading: false });
        }
      },

      removeCoupon: () => {
        set({ coupon: null });
        get().syncTotals();
      },

      // ================= SAFE TOTAL ENGINE =================
      syncTotals: () => {
        const state = get();
        const cart = Array.isArray(state.cart) ? state.cart : [];

        const subtotal = cart.reduce(
          (sum, item) =>
            sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
          0
        );

        let discount = 0;
        let total = subtotal;

        if (state.coupon?.discountPercentage) {
          discount = (subtotal * state.coupon.discountPercentage) / 100;
          total = subtotal - discount;
        }

        set({ subtotal, total, discount });
      },

      // ================= CART CORE =================
      addToCart: (product, size) => {
        set((state) => {
          const cart = Array.isArray(state.cart) ? state.cart : [];

          const existingItem = cart.find(
            (item) =>
              item.productId === product._id &&
              item.size === size
          );

          let updated;

          if (existingItem) {
            updated = cart.map((item) =>
              item.productId === product._id &&
              item.size === size
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            updated = [
              ...cart,
              {
                productId: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category,
                size: size || null,
                quantity: 1,
              },
            ];
          }

          return { cart: updated };
        });

        get().syncTotals();
      },

      removeFromCart: (productId, size) => {
        set((state) => ({
          cart: (state.cart || []).filter(
            (item) =>
              !(item.productId === productId && item.size === size)
          ),
        }));

        get().syncTotals();
      },

      updateQuantity: (productId, size, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId, size);
          return;
        }

        set((state) => ({
          cart: (state.cart || []).map((item) =>
            item.productId === productId && item.size === size
              ? { ...item, quantity }
              : item
          ),
        }));

        get().syncTotals();
      },

      clearCart: () => {
        set({
          cart: [],
          coupon: null,
          subtotal: 0,
          total: 0,
          discount: 0,
        });

      },

      // ================= LOAD CART (LOGIN SAFE) =================
      getCartItems: async () => {
        try {
          const state = get();
          if (!state.user?._id) return;

          const res = await api.get("/cart");

          const serverCart = Array.isArray(res.data) ? res.data : [];

          set({ cart: serverCart });

          get().syncTotals();
        } catch (error) {
          console.log("Cart load failed", error);
        }
      },

      // ================= INIT =================
      initializeStore: async () => {
        await get().getCartItems();},
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        cart: state.cart,
        
      }),
    }
  )
);

export default cartStore;