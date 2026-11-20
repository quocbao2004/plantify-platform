import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminReturnsApi } from "../api/adminReturnsApi";
import { AdminReturnQueryParams, UpdateAdminReturnPayload } from "../types";
import { MESSAGES } from "@/constants/messages";

export const ADMIN_RETURNS_QUERY_KEY = ["admin-returns"] as const;

export const useAdminReturns = (params?: AdminReturnQueryParams) => {
  return useQuery({
    queryKey: [...ADMIN_RETURNS_QUERY_KEY, params],
    queryFn: () => adminReturnsApi.getReturns(params),
  });
};

export const useAdminReturnDetail = (id?: string) => {
  return useQuery({
    queryKey: [...ADMIN_RETURNS_QUERY_KEY, "detail", id],
    queryFn: () => (id ? adminReturnsApi.getReturnDetail(id) : Promise.reject("No id")),
    enabled: Boolean(id),
  });
};

export const useUpdateAdminReturn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAdminReturnPayload;
    }) => adminReturnsApi.updateReturn(id, payload),
    meta: {
      successMessage: MESSAGES.RETURN_STATUS_UPDATED,
      errorMessage: MESSAGES.RETURN_STATUS_UPDATE_ERROR,
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_RETURNS_QUERY_KEY });
    },
  });
};
