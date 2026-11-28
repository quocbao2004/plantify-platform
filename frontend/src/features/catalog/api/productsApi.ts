import { httpClient } from "@/services/api";
import { API_ENDPOINTS } from "@/constants";
import { env } from "@/config/env";
import { PaginatedResponse } from "@/types";
import { Product, Category, ProductQueryParams } from "../types";
import { lightToApi, normalizeCollection, normalizeProduct, resolveMediaUrl, type ApiProduct, type CollectionResponse } from "./responseAdapters";

const apiBaseUrl = () => httpClient.defaults.baseURL || env.VITE_API_BASE_URL;

export const productsApi = {
  getProducts: async (params?: ProductQueryParams): Promise<PaginatedResponse<Product>> => {
    const { data } = await httpClient.get<CollectionResponse<ApiProduct>>(API_ENDPOINTS.CATALOG.PRODUCTS, {
      params: {
        ...params,
        is_active: true,
        light_requirement: params?.light_requirement ? lightToApi[params.light_requirement] : undefined,
      },
    });
    const page = normalizeCollection(data);
    return { ...page, results: page.results.map((product) => normalizeProduct(product, apiBaseUrl())) };
  },

  getProductDetail: async (idOrSlug: string): Promise<Product> => {
    const { data } = await httpClient.get<ApiProduct>(`${API_ENDPOINTS.CATALOG.PRODUCTS}${idOrSlug}/`);
    return normalizeProduct(data, apiBaseUrl());
  },

  getCategories: async (): Promise<PaginatedResponse<Category>> => {
    const { data } = await httpClient.get<CollectionResponse<Category>>(API_ENDPOINTS.CATALOG.CATEGORIES, {
      params: { is_active: true },
    });
    const page = normalizeCollection(data);
    const results = page.results.map((category) => ({
      ...category,
      image_url: resolveMediaUrl(category.image_url, apiBaseUrl()),
    }));
    return { ...page, results };
  },
};
