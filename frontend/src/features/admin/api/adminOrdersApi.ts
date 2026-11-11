import { httpClient } from "@/services/api";
import { API_ENDPOINTS } from "@/constants";
import { PaginatedResponse } from "@/types";
import {
  AdminOrder,
  AdminOrderQueryParams,
  UpdateAdminOrderStatusPayload,
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

export const adminOrdersApi = {
  getOrders: async (
    params?: AdminOrderQueryParams
  ): Promise<PaginatedResponse<AdminOrder>> => {
    const { data } = await httpClient.get<
      BackendStandardPaginatedResponse<AdminOrder> | AdminOrder[]
    >(API_ENDPOINTS.ADMIN.ORDERS, { params });

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

  getOrderDetail: async (id: string): Promise<AdminOrder> => {
    const { data } = await httpClient.get<
      { data?: AdminOrder } | AdminOrder
    >(`${API_ENDPOINTS.ADMIN.ORDERS}${id}/`);
    return data && "data" in data && data.data ? data.data : (data as AdminOrder);
  },

  updateOrderStatus: async (
    id: string,
    payload: UpdateAdminOrderStatusPayload
  ): Promise<AdminOrder> => {
    const { data } = await httpClient.patch<
      { data?: AdminOrder } | AdminOrder
    >(`${API_ENDPOINTS.ADMIN.ORDERS}${id}/`, payload);
    return data && "data" in data && data.data ? data.data : (data as AdminOrder);
  },
};
