import { httpClient } from "@/services/api";
import { API_ENDPOINTS } from "@/constants";
import { PaginatedResponse } from "@/types";
import {
  AdminShipment,
  AdminShipper,
  AdminShipmentQueryParams,
  UpdateAdminShipmentPayload,
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

export const adminShippingApi = {
  getShipments: async (
    params?: AdminShipmentQueryParams
  ): Promise<PaginatedResponse<AdminShipment>> => {
    const { data } = await httpClient.get<
      BackendStandardPaginatedResponse<AdminShipment> | AdminShipment[]
    >(API_ENDPOINTS.ADMIN.SHIPMENTS, { params });

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

  getShipmentDetail: async (id: string): Promise<AdminShipment> => {
    const { data } = await httpClient.get<
      { data?: AdminShipment } | AdminShipment
    >(`${API_ENDPOINTS.ADMIN.SHIPMENTS}${id}/`);
    return data && "data" in data && data.data ? data.data : (data as AdminShipment);
  },

  updateShipment: async (
    id: string,
    payload: UpdateAdminShipmentPayload
  ): Promise<AdminShipment> => {
    const { data } = await httpClient.patch<
      { data?: AdminShipment } | AdminShipment
    >(`${API_ENDPOINTS.ADMIN.SHIPMENTS}${id}/`, payload);
    return data && "data" in data && data.data ? data.data : (data as AdminShipment);
  },

  getShippers: async (): Promise<AdminShipper[]> => {
    const { data } = await httpClient.get<
      { success?: boolean; data?: AdminShipper[] } | AdminShipper[]
    >(API_ENDPOINTS.ADMIN.SHIPPERS);
    if (data && "data" in data && Array.isArray(data.data)) {
      return data.data;
    }
    if (Array.isArray(data)) {
      return data;
    }
    return [];
  },
};
