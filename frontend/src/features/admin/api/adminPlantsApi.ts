import { httpClient } from "@/services/api";
import { API_ENDPOINTS } from "@/constants";
import { PaginatedResponse } from "@/types";
import {
  AdminPlant,
  AdminPlantQueryParams,
  CreateAdminPlantPayload,
  UpdateAdminPlantPayload,
  AdminCategory,
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

export const adminPlantsApi = {
  getPlants: async (
    params?: AdminPlantQueryParams
  ): Promise<PaginatedResponse<AdminPlant>> => {
    const { data } = await httpClient.get<
      BackendStandardPaginatedResponse<AdminPlant> | AdminPlant[]
    >(API_ENDPOINTS.ADMIN.PLANTS, { params });

    // Format 1: Plantify StandardResultsSetPagination
    if (data && "data" in data && Array.isArray(data.data)) {
      return {
        count: data.pagination?.count ?? data.data.length,
        next: data.pagination?.next ?? null,
        previous: data.pagination?.previous ?? null,
        results: data.data,
      };
    }

    // Format 2: Direct array
    if (Array.isArray(data)) {
      return {
        count: data.length,
        next: null,
        previous: null,
        results: data,
      };
    }

    // Format 3: DRF PageNumberPagination
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

  getPlantDetail: async (id: string): Promise<AdminPlant> => {
    const { data } = await httpClient.get<{ data?: AdminPlant } | AdminPlant>(
      `${API_ENDPOINTS.ADMIN.PLANTS}${id}/`
    );
    return data && "data" in data && data.data ? data.data : (data as AdminPlant);
  },

  createPlant: async (payload: CreateAdminPlantPayload): Promise<AdminPlant> => {
    const { data } = await httpClient.post<{ data?: AdminPlant } | AdminPlant>(
      API_ENDPOINTS.ADMIN.PLANTS,
      payload
    );
    return data && "data" in data && data.data ? data.data : (data as AdminPlant);
  },

  updatePlant: async (
    id: string,
    payload: UpdateAdminPlantPayload
  ): Promise<AdminPlant> => {
    const { data } = await httpClient.patch<{ data?: AdminPlant } | AdminPlant>(
      `${API_ENDPOINTS.ADMIN.PLANTS}${id}/`,
      payload
    );
    return data && "data" in data && data.data ? data.data : (data as AdminPlant);
  },

  deletePlant: async (id: string): Promise<void> => {
    await httpClient.delete(`${API_ENDPOINTS.ADMIN.PLANTS}${id}/`);
  },

  getCategories: async (): Promise<PaginatedResponse<AdminCategory>> => {
    const { data } = await httpClient.get<
      BackendStandardPaginatedResponse<AdminCategory> | AdminCategory[]
    >(API_ENDPOINTS.ADMIN.CATEGORIES);

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
};
