import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  productIds: string[];
  toggle: (productId: string) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      productIds: [],
      toggle: (productId) => set((state) => ({
        productIds: state.productIds.includes(productId)
          ? state.productIds.filter((id) => id !== productId)
          : [...state.productIds, productId],
      })),
    }),
    { name: "plantify-wishlist-v1" },
  ),
);
