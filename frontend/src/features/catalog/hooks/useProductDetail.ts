import { useQuery } from "@tanstack/react-query";
import { productsApi } from "../api/productsApi";

export const useProductDetail = (idOrSlug: string) => {
  return useQuery({
    queryKey: ["product", idOrSlug],
    queryFn: () => productsApi.getProductDetail(idOrSlug),
    enabled: Boolean(idOrSlug),
  });
};
