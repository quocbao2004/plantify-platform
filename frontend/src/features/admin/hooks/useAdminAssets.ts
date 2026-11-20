import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notify } from "@/services/notifications";
import { MESSAGES } from "@/constants/messages";
import { adminAssetsApi } from "../api/adminAssetsApi";
import {
  AdminPlantAssetQueryParams,
  BatchGenerateAssetsPayload,
  UpdateAdminPlantAssetPayload,
} from "../types";

export const ADMIN_ASSETS_QUERY_KEY = ["admin-plant-assets"] as const;

export const useAdminAssets = (params?: AdminPlantAssetQueryParams) => {
  return useQuery({
    queryKey: [...ADMIN_ASSETS_QUERY_KEY, params],
    queryFn: () => adminAssetsApi.getAssets(params),
    staleTime: 1000 * 30, // 30s
  });
};

export const useAdminAssetDetail = (idOrCode: string) => {
  return useQuery({
    queryKey: [...ADMIN_ASSETS_QUERY_KEY, "detail", idOrCode],
    queryFn: () => adminAssetsApi.getAssetDetail(idOrCode),
    enabled: Boolean(idOrCode),
  });
};

export const useBatchGenerateAssets = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BatchGenerateAssetsPayload) =>
      adminAssetsApi.batchGenerate(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ASSETS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["admin-plants"] });
      notify.success(MESSAGES.ASSETS_GENERATED_SUCCESS(res.count));
    },
    onError: () => {
      notify.error(MESSAGES.ASSETS_GENERATE_ERROR);
    },
  });
};

export const useUpdateAdminAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAdminPlantAssetPayload;
    }) => adminAssetsApi.updateAsset(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ASSETS_QUERY_KEY });
      notify.success(MESSAGES.ASSET_UPDATED_SUCCESS);
    },
    onError: () => {
      notify.error(MESSAGES.ASSET_UPDATE_ERROR);
    },
  });
};
