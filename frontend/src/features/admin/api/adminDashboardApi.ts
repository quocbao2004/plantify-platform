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
    if (data && data.stats) {
      return data;
    }
    // Fallback if flat response
    if (data && typeof data === "object") {
      const totalInventory = Number(data.total_plants ?? 0);
      return {
        stats: {
          revenue: Number(data.total_revenue ?? 0),
          revenue_trend_pct: 12.5,
          total_orders: Number((data.total_purchase_orders ?? 0) + (data.total_rental_orders ?? 0)),
          pending_orders: 0,
          total_inventory: totalInventory,
          inventory_indoor: totalInventory,
          inventory_desktop: 0,
          inventory_accessory: 0,
          new_consults: 0,
        },
        recent_orders: data.recent_orders ?? [],
        recent_consults: data.recent_consults ?? [],
      };
    }
    return data;
  },
};
