import { useQuery } from "@tanstack/react-query";
import { adminDashboardApi } from "../api/adminDashboardApi";

export const ADMIN_DASHBOARD_QUERY_KEY = ["admin-dashboard-summary"] as const;

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ADMIN_DASHBOARD_QUERY_KEY,
    queryFn: adminDashboardApi.getSummary,
    staleTime: 1000 * 60 * 2, // 2 phút
  });
};
