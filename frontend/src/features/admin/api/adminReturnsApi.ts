import { httpClient } from "@/services/api";
import { API_ENDPOINTS } from "@/constants";
import { PaginatedResponse } from "@/types";
import {
  AdminReturnRequest,
  AdminReturnQueryParams,
  UpdateAdminReturnPayload,
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

export const adminReturnsApi = {
  getReturns: async (
    params?: AdminReturnQueryParams
  ): Promise<PaginatedResponse<AdminReturnRequest>> => {
    const { data } = await httpClient.get<
      BackendStandardPaginatedResponse<AdminReturnRequest> | AdminReturnRequest[]
    >(API_ENDPOINTS.ADMIN.RETURNS, { params });

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

  getReturnDetail: async (id: string): Promise<AdminReturnRequest> => {
    const { data } = await httpClient.get<
      { data?: AdminReturnRequest } | AdminReturnRequest
    >(`${API_ENDPOINTS.ADMIN.RETURNS}${id}/`);
    return data && "data" in data && data.data ? data.data : (data as AdminReturnRequest);
  },

  updateReturn: async (
    id: string,
    payload: UpdateAdminReturnPayload
  ): Promise<AdminReturnRequest> => {
    const { data } = await httpClient.patch<
      { data?: AdminReturnRequest } | AdminReturnRequest
    >(`${API_ENDPOINTS.ADMIN.RETURNS}${id}/`, payload);
    return data && "data" in data && data.data ? data.data : (data as AdminReturnRequest);
  },
};
