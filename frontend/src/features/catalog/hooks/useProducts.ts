import { useQuery } from "@tanstack/react-query";
import { productsApi } from "../api/productsApi";
import { ProductQueryParams } from "../types";

export const useProducts = (params?: ProductQueryParams, options?: { silentError?: boolean }) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productsApi.getProducts(params),
    meta: { silentError: options?.silentError },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => productsApi.getCategories(),
  });
};
