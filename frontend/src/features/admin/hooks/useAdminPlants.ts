import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminPlantsApi } from "../api/adminPlantsApi";
import {
  AdminPlantQueryParams,
  CreateAdminPlantPayload,
  UpdateAdminPlantPayload,
} from "../types";
import { MESSAGES } from "@/constants/messages";

export const ADMIN_PLANTS_QUERY_KEY = ["admin-plants"] as const;
export const ADMIN_CATEGORIES_QUERY_KEY = ["admin-categories"] as const;

export const useAdminPlants = (params?: AdminPlantQueryParams) => {
  return useQuery({
    queryKey: [...ADMIN_PLANTS_QUERY_KEY, params],
    queryFn: () => adminPlantsApi.getPlants(params),
  });
};

export const useAdminPlantDetail = (id?: string) => {
  return useQuery({
    queryKey: [...ADMIN_PLANTS_QUERY_KEY, "detail", id],
    queryFn: () => (id ? adminPlantsApi.getPlantDetail(id) : Promise.reject(new Error("No id"))),
    enabled: Boolean(id),
  });
};

export const useAdminCategories = () => {
  return useQuery({
    queryKey: ADMIN_CATEGORIES_QUERY_KEY,
    queryFn: () => adminPlantsApi.getCategories(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCreateAdminPlant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdminPlantPayload) =>
      adminPlantsApi.createPlant(payload),
    meta: {
      successMessage: MESSAGES.PLANT_CREATED,
      errorMessage: MESSAGES.PLANT_CREATE_ERROR,
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PLANTS_QUERY_KEY });
    },
  });
};

export const useUpdateAdminPlant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAdminPlantPayload;
    }) => adminPlantsApi.updatePlant(id, payload),
    meta: {
      successMessage: MESSAGES.PLANT_UPDATED,
      errorMessage: MESSAGES.PLANT_UPDATE_ERROR,
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PLANTS_QUERY_KEY });
    },
  });
};

export const useDeleteAdminPlant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminPlantsApi.deletePlant(id),
    meta: {
      successMessage: MESSAGES.PLANT_DELETED,
      errorMessage: MESSAGES.PLANT_DELETE_ERROR,
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PLANTS_QUERY_KEY });
    },
  });
};
