import { httpClient } from "@/services/api";
import { API_ENDPOINTS } from "@/constants";
import type { CartItem, CartQuote } from "../types";

export const cartApi = {
  quote: async (items: CartItem[], signal?: AbortSignal): Promise<CartQuote> => {
    const { data } = await httpClient.post<CartQuote>(API_ENDPOINTS.ORDERS.CART_QUOTE, { items }, { signal });
    return data;
  },
};
