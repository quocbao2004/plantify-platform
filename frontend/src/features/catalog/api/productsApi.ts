import { httpClient } from "@/services/api";
import { API_ENDPOINTS } from "@/constants";
import { PaginatedResponse } from "@/types";
import { Product, Category, ProductQueryParams } from "../types";

export const productsApi = {
  getProducts: async (params?: ProductQueryParams): Promise<PaginatedResponse<Product>> => {
    const { data } = await httpClient.get<PaginatedResponse<Product>>(API_ENDPOINTS.CATALOG.PRODUCTS, {
      params,
    });
    return data;
  },

  getProductDetail: async (idOrSlug: string): Promise<Product> => {
    const { data } = await httpClient.get<Product>(`${API_ENDPOINTS.CATALOG.PRODUCTS}${idOrSlug}/`);
    return data;
  },

  getCategories: async (): Promise<PaginatedResponse<Category>> => {
    const { data } = await httpClient.get<PaginatedResponse<Category>>(API_ENDPOINTS.CATALOG.CATEGORIES);
    return data;
  },
};
