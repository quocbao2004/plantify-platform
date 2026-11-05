import { httpClient } from "@/services/api";
import { API_ENDPOINTS } from "@/constants";

export interface DashboardSummaryStats {
  revenue: number;
  revenue_trend_pct: number;
  total_orders: number;
  pending_orders: number;
  total_inventory: number;
  inventory_indoor: number;
  inventory_desktop: number;
  inventory_accessory: number;
  new_consults: number;
}

export interface DashboardRecentOrder {
  id: string;
  customer_name: string;
  product_name: string;
  special_note: string;
  status: string;
  total: number | null;
}

export interface DashboardRecentConsult {
  id: string;
  initials: string;
  customer_name: string;
  phone: string;
  topic: string;
  note: string;
  status: "not_called" | "supported";
}

export interface AdminDashboardResponse {
  stats: DashboardSummaryStats;
  recent_orders: DashboardRecentOrder[];
  recent_consults: DashboardRecentConsult[];
}

export const adminDashboardApi = {
  getSummary: async (): Promise<AdminDashboardResponse> => {
    const { data } = await httpClient.get<any>(
      API_ENDPOINTS.ADMIN.DASHBOARD
    );
    if (data && data.data && data.data.stats) {
      return data.data;
    }
    return data;
  },
};
