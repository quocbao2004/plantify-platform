import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminOrdersApi } from "../api/adminOrdersApi";
import { AdminOrderQueryParams, UpdateAdminOrderStatusPayload } from "../types";
import { MESSAGES } from "@/constants/messages";

export const ADMIN_ORDERS_QUERY_KEY = ["admin-orders"] as const;

export const useAdminOrders = (params?: AdminOrderQueryParams) => {
  return useQuery({
    queryKey: [...ADMIN_ORDERS_QUERY_KEY, params],
    queryFn: () => adminOrdersApi.getOrders(params),
  });
};

export const useAdminOrderDetail = (id?: string) => {
  return useQuery({
    queryKey: [...ADMIN_ORDERS_QUERY_KEY, "detail", id],
    queryFn: () => (id ? adminOrdersApi.getOrderDetail(id) : Promise.reject("No id")),
    enabled: Boolean(id),
  });
};

export const useUpdateAdminOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAdminOrderStatusPayload;
    }) => adminOrdersApi.updateOrderStatus(id, payload),
    meta: {
      successMessage: MESSAGES.ORDER_STATUS_UPDATED,
      errorMessage: MESSAGES.ORDER_STATUS_UPDATE_ERROR,
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ORDERS_QUERY_KEY });
    },
  });
};
