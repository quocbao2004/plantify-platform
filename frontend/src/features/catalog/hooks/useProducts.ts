import { useQuery } from "@tanstack/react-query";
import { productsApi } from "../api/productsApi";
import { ProductQueryParams } from "../types";

export const useProducts = (params?: ProductQueryParams, options?: { silentError?: boolean; enabled?: boolean }) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productsApi.getProducts(params),
    enabled: options?.enabled,
    meta: { silentError: options?.silentError },
  });
};

export const useCategories = (options?: { silentError?: boolean }) => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => productsApi.getCategories(),
    meta: { silentError: options?.silentError },
  });
};
