import { httpClient } from "@/services/api";
import { API_ENDPOINTS } from "@/constants";
import { env } from "@/config/env";
import { PaginatedResponse } from "@/types";
import { Product, Category, ProductQueryParams } from "../types";
import { lightToApi, normalizeCollection, normalizeProduct, type ApiProduct, type CollectionResponse } from "./responseAdapters";

const apiBaseUrl = () => httpClient.defaults.baseURL || env.VITE_API_BASE_URL;

export const productsApi = {
  getProducts: async (params?: ProductQueryParams): Promise<PaginatedResponse<Product>> => {
    const { data } = await httpClient.get<CollectionResponse<ApiProduct>>(API_ENDPOINTS.CATALOG.PRODUCTS, {
      params: params ? {
        ...params,
        light_requirement: params.light_requirement ? lightToApi[params.light_requirement] : undefined,
      } : undefined,
    });
    const page = normalizeCollection(data);
    return { ...page, results: page.results.map((product) => normalizeProduct(product, apiBaseUrl())) };
  },

  getProductDetail: async (idOrSlug: string): Promise<Product> => {
    const { data } = await httpClient.get<ApiProduct>(`${API_ENDPOINTS.CATALOG.PRODUCTS}${idOrSlug}/`);
    return normalizeProduct(data, apiBaseUrl());
  },

  getCategories: async (): Promise<PaginatedResponse<Category>> => {
    const { data } = await httpClient.get<CollectionResponse<Category>>(API_ENDPOINTS.CATALOG.CATEGORIES);
    return normalizeCollection(data);
  },
};
