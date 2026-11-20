import { httpClient } from "@/services/api";
import { API_ENDPOINTS } from "@/constants";
import { PaginatedResponse } from "@/types";
import {
  AdminPlantAsset,
  AdminPlantAssetQueryParams,
  BatchGenerateAssetsPayload,
  UpdateAdminPlantAssetPayload,
} from "../types";

export const adminAssetsApi = {
  getAssets: async (
    params?: AdminPlantAssetQueryParams
  ): Promise<PaginatedResponse<AdminPlantAsset>> => {
    const { data } = await httpClient.get<any>(
      API_ENDPOINTS.CATALOG.PLANT_ASSETS,
      { params }
    );

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

  getAssetDetail: async (idOrCode: string): Promise<AdminPlantAsset> => {
    const { data } = await httpClient.get<AdminPlantAsset>(
      `${API_ENDPOINTS.CATALOG.PLANT_ASSETS}${idOrCode}/`
    );
    return data;
  },

  batchGenerate: async (
    payload: BatchGenerateAssetsPayload
  ): Promise<{ success: boolean; message: string; count: number; data: AdminPlantAsset[] }> => {
    const { data } = await httpClient.post(
      API_ENDPOINTS.CATALOG.PLANT_ASSETS_BATCH,
      payload
    );
    return data;
  },

  updateAsset: async (
    id: string,
    payload: UpdateAdminPlantAssetPayload
  ): Promise<AdminPlantAsset> => {
    const { data } = await httpClient.patch<AdminPlantAsset>(
      `${API_ENDPOINTS.CATALOG.PLANT_ASSETS}${id}/`,
      payload
    );
    return data;
  },
};
