import { httpClient } from "@/services/api";
import { API_ENDPOINTS } from "@/constants";
import { PaginatedResponse } from "@/types";
import { AdminUser, AdminUserQueryParams, UpdateAdminUserPayload } from "../types";

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

export const adminUsersApi = {
  getUsers: async (
    params?: AdminUserQueryParams
  ): Promise<PaginatedResponse<AdminUser>> => {
    const { data } = await httpClient.get<
      BackendStandardPaginatedResponse<AdminUser> | AdminUser[]
    >(API_ENDPOINTS.ADMIN.USERS, { params });

    // Trường hợp 1: Backend trả về dạng Plantify StandardResultsSetPagination:
    // { success: true, pagination: { count, next, previous }, data: [...] }
    if (data && "data" in data && Array.isArray(data.data)) {
      return {
        count: data.pagination?.count ?? data.data.length,
        next: data.pagination?.next ?? null,
        previous: data.pagination?.previous ?? null,
        results: data.data,
      };
    }

    // Trường hợp 2: Backend trả về danh sách mảng trực tiếp: [...]
    if (Array.isArray(data)) {
      return {
        count: data.length,
        next: null,
        previous: null,
        results: data,
      };
    }

    // Trường hợp 3: Backend trả về dạng DRF PageNumberPagination mặc định:
    // { count, next, previous, results: [...] }
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

  getUserDetail: async (id: string): Promise<AdminUser> => {
    const { data } = await httpClient.get<any>(
      `${API_ENDPOINTS.ADMIN.USERS}${id}/`
    );
    return data && data.data ? data.data : data;
  },

  updateUser: async (
    id: string,
    payload: UpdateAdminUserPayload
  ): Promise<AdminUser> => {
    const { data } = await httpClient.patch<any>(
      `${API_ENDPOINTS.ADMIN.USERS}${id}/`,
      payload
    );
    return data && data.data ? data.data : data;
  },
};
