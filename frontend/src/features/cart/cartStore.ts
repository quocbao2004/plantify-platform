import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/constants";
import type { CartItem } from "./types";

const MAX_CART_LINES = 50;
export const MAX_CART_QUANTITY = 99;

interface CheckoutAttempt {
  key: string;
  userId: string;
}

interface CartState {
  items: CartItem[];
  checkoutAttempt: CheckoutAttempt | null;
  addItem: (variantId: string, quantity: number, stock: number) => boolean;
  setQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  beginCheckout: (userId: string) => string;
  finishCheckout: (key: string) => void;
}

export const useCartStore = create<CartState>()(
  persist((set, get) => ({
    items: [],
    checkoutAttempt: null,
    addItem: (variantId, quantity, stock) => {
      const { items, setQuantity } = get();
      const existing = items.find((item) => item.plant_detail === variantId);
      const nextQuantity = (existing?.quantity ?? 0) + quantity;
      if (!Number.isInteger(quantity) || quantity < 1 || nextQuantity > Math.min(stock, MAX_CART_QUANTITY)) return false;
      if (!existing && items.length >= MAX_CART_LINES) return false;

      if (existing) {
        setQuantity(variantId, nextQuantity);
      } else {
        set({ items: [...items, { plant_detail: variantId, quantity }], checkoutAttempt: null });
      }
      return true;
    },
    setQuantity: (variantId, quantity) => {
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_CART_QUANTITY) return;
      set((state) => ({
        items: state.items.map((item) => item.plant_detail === variantId ? { ...item, quantity } : item),
        checkoutAttempt: null,
      }));
    },
    removeItem: (variantId) => set((state) => ({
      items: state.items.filter((item) => item.plant_detail !== variantId),
      checkoutAttempt: null,
    })),
    beginCheckout: (userId) => {
      const { checkoutAttempt } = get();
      if (checkoutAttempt?.userId === userId) return checkoutAttempt.key;
      const key = crypto.randomUUID();
      set({ checkoutAttempt: { key, userId } });
      return key;
    },
    finishCheckout: (key) => {
      if (get().checkoutAttempt?.key === key) set({ items: [], checkoutAttempt: null });
    },
  }), { name: STORAGE_KEYS.CART }),
);
