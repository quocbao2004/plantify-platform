import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminShippingApi } from "../api/adminShippingApi";
import { AdminShipmentQueryParams, UpdateAdminShipmentPayload } from "../types";
import { ADMIN_ORDERS_QUERY_KEY } from "./useAdminOrders";
import { MESSAGES } from "@/constants/messages";

export const ADMIN_SHIPPING_QUERY_KEY = ["admin-shipments"] as const;
export const ADMIN_SHIPPERS_QUERY_KEY = ["admin-shippers"] as const;

export const useAdminShipments = (params?: AdminShipmentQueryParams) => {
  return useQuery({
    queryKey: [...ADMIN_SHIPPING_QUERY_KEY, params],
    queryFn: () => adminShippingApi.getShipments(params),
  });
};

export const useAdminShipmentDetail = (id?: string) => {
  return useQuery({
    queryKey: [...ADMIN_SHIPPING_QUERY_KEY, "detail", id],
    queryFn: () => (id ? adminShippingApi.getShipmentDetail(id) : Promise.reject("No id")),
    enabled: Boolean(id),
  });
};

export const useAdminShippers = () => {
  return useQuery({
    queryKey: ADMIN_SHIPPERS_QUERY_KEY,
    queryFn: () => adminShippingApi.getShippers(),
  });
};

export const useUpdateAdminShipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAdminShipmentPayload;
    }) => adminShippingApi.updateShipment(id, payload),
    meta: {
      successMessage: MESSAGES.SHIPMENT_ASSIGNED_SUCCESS,
      errorMessage: MESSAGES.SHIPMENT_ASSIGNED_ERROR,
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SHIPPING_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_ORDERS_QUERY_KEY });
    },
  });
};
