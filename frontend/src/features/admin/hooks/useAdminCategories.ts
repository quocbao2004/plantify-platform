import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminCategoriesApi } from "../api/adminCategoriesApi";
import {
  AdminCategoryQueryParams,
  CreateAdminCategoryPayload,
  UpdateAdminCategoryPayload,
  AdminCategory,
} from "../types";
import { MESSAGES } from "@/constants/messages";
import { ADMIN_PLANTS_QUERY_KEY } from "./useAdminPlants";

export const ADMIN_CATEGORIES_QUERY_KEY = ["admin-categories"] as const;

export const useAdminCategories = (params?: AdminCategoryQueryParams) => {
  return useQuery({
    queryKey: [...ADMIN_CATEGORIES_QUERY_KEY, params],
    queryFn: () => adminCategoriesApi.getCategories(params),
  });
};

export const useAdminCategoryDetail = (id?: string) => {
  return useQuery({
    queryKey: [...ADMIN_CATEGORIES_QUERY_KEY, "detail", id],
    queryFn: () =>
      id ? adminCategoriesApi.getCategoryDetail(id) : Promise.reject(new Error("No id")),
    enabled: Boolean(id),
  });
};

export const useCreateAdminCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdminCategoryPayload) =>
      adminCategoriesApi.createCategory(payload),
    meta: {
      successMessage: MESSAGES.CATEGORY_CREATED,
      errorMessage: MESSAGES.CATEGORY_CREATE_ERROR,
    },
    onSuccess: (newCat: AdminCategory) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_PLANTS_QUERY_KEY });
      return newCat;
    },
  });
};

export const useUpdateAdminCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAdminCategoryPayload;
    }) => adminCategoriesApi.updateCategory(id, payload),
    meta: {
      successMessage: MESSAGES.CATEGORY_UPDATED,
      errorMessage: MESSAGES.CATEGORY_UPDATE_ERROR,
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_PLANTS_QUERY_KEY });
    },
  });
};

export const useDeleteAdminCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminCategoriesApi.deleteCategory(id),
    meta: {
      successMessage: MESSAGES.CATEGORY_DELETED,
      errorMessage: MESSAGES.CATEGORY_DELETE_ERROR,
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_PLANTS_QUERY_KEY });
    },
  });
};
