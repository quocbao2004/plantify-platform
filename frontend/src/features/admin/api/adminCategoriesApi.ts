import { httpClient } from "@/services/api";
import { API_ENDPOINTS } from "@/constants";
import { PaginatedResponse } from "@/types";
import {
  AdminCategory,
  AdminCategoryQueryParams,
  CreateAdminCategoryPayload,
  UpdateAdminCategoryPayload,
} from "../types";

interface BackendStandardPaginatedResponse<T> {
  success?: boolean;
  pagination?: {
    count: number;
    total_pages?: number;
    current_page?: number;
    page_size?: number;
    next?: string | null;
    previous?: string | null;
  };
  data?: T[];
  results?: T[];
  count?: number;
  next?: string | null;
  previous?: string | null;
}

export const adminCategoriesApi = {
  getCategories: async (
    params?: AdminCategoryQueryParams
  ): Promise<PaginatedResponse<AdminCategory>> => {
    const { data } = await httpClient.get<
      BackendStandardPaginatedResponse<AdminCategory> | AdminCategory[]
    >(API_ENDPOINTS.ADMIN.CATEGORIES, { params });

    if (data && "data" in data && Array.isArray(data.data)) {
      return {
        count: data.pagination?.count ?? data.data.length,
        next: data.pagination?.next ?? null,
        previous: data.pagination?.previous ?? null,
        results: data.data,
      };
    }

    if (Array.isArray(data)) {
      return {
        count: data.length,
        next: null,
        previous: null,
        results: data,
      };
    }

    if (data && "results" in data && Array.isArray(data.results)) {
      return {
        count: data.count ?? data.results.length,
        next: data.next ?? null,
        previous: data.previous ?? null,
        results: data.results,
      };
    }

    return {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };
  },

  getCategoryDetail: async (id: string): Promise<AdminCategory> => {
    const { data } = await httpClient.get<{ data?: AdminCategory } | AdminCategory>(
      `${API_ENDPOINTS.ADMIN.CATEGORIES}${id}/`
    );
    return data && "data" in data && data.data ? data.data : (data as AdminCategory);
  },

  createCategory: async (
    payload: CreateAdminCategoryPayload
  ): Promise<AdminCategory> => {
    const { data } = await httpClient.post<{ data?: AdminCategory } | AdminCategory>(
      API_ENDPOINTS.ADMIN.CATEGORIES,
      payload
    );
    return data && "data" in data && data.data ? data.data : (data as AdminCategory);
  },

  updateCategory: async (
    id: string,
    payload: UpdateAdminCategoryPayload
  ): Promise<AdminCategory> => {
    const { data } = await httpClient.patch<{ data?: AdminCategory } | AdminCategory>(
      `${API_ENDPOINTS.ADMIN.CATEGORIES}${id}/`,
      payload
    );
    return data && "data" in data && data.data ? data.data : (data as AdminCategory);
  },

  deleteCategory: async (id: string): Promise<void> => {
    await httpClient.delete(`${API_ENDPOINTS.ADMIN.CATEGORIES}${id}/`);
  },
};
