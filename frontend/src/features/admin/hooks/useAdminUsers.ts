import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminUsersApi } from "../api/adminUsersApi";
import { AdminUserQueryParams, UpdateAdminUserPayload } from "../types";
import { MESSAGES } from "@/constants/messages";

export const ADMIN_USERS_QUERY_KEY = ["admin-users"] as const;

export const useAdminUsers = (params?: AdminUserQueryParams) => {
  return useQuery({
    queryKey: [...ADMIN_USERS_QUERY_KEY, params],
    queryFn: () => adminUsersApi.getUsers(params),
  });
};

export const useUpdateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAdminUserPayload;
    }) => adminUsersApi.updateUser(id, payload),
    meta: {
      successMessage: MESSAGES.USER_STATUS_UPDATED,
      errorMessage: MESSAGES.USER_STATUS_UPDATE_ERROR,
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
    },
  });
};
