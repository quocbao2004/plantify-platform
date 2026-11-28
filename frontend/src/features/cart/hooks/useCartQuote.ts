import { useQuery } from "@tanstack/react-query";
import { cartApi } from "../api/cartApi";
import { useCartStore } from "../cartStore";
import type { CartQuoteLine } from "../types";

export function canBuyCartLine(item: CartQuoteLine) {
  return item.unit_price !== null && item.quantity <= item.available_quantity;
}

export function useCartQuote() {
  const items = useCartStore((state) => state.items);
  const query = useQuery({
    queryKey: ["cart-quote", items],
    queryFn: ({ signal }) => cartApi.quote(items, signal),
    enabled: items.length > 0,
    staleTime: 0,
    meta: { silentError: true },
  });
  return { ...query, items };
}
