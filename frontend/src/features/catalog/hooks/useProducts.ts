import { useQuery } from "@tanstack/react-query";
import { productsApi } from "../api/productsApi";
import { ProductQueryParams } from "../types";

export const useProducts = (params?: ProductQueryParams) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productsApi.getProducts(params),
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => productsApi.getCategories(),
  });
};
