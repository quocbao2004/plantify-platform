import { httpClient } from "@/services/api";
import { API_ENDPOINTS } from "@/constants";
import { Cart } from "../types";

export const cartApi = {
  getCart: async (): Promise<Cart> => {
    const { data } = await httpClient.get<Cart>(API_ENDPOINTS.ORDERS.CART);
    return data;
  },

  addItem: async (variantId: string, quantity: number = 1): Promise<Cart> => {
    const { data } = await httpClient.post<Cart>(`${API_ENDPOINTS.ORDERS.CART}items/`, {
      variant: variantId,
      quantity,
    });
    return data;
  },

  removeItem: async (itemId: string): Promise<void> => {
    await httpClient.delete(`${API_ENDPOINTS.ORDERS.CART}items/${itemId}/`);
  },
};
