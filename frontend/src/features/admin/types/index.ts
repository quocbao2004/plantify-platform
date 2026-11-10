import { UserRole } from "@/types";

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: UserRole | string;
  is_active: boolean;
  date_joined: string;
  created_at: string;
  updated_at: string;
}

export interface AdminUserQueryParams {
  search?: string;
  role?: string;
  is_active?: boolean | string;
  page?: number;
  page_size?: number;
}

export interface UpdateAdminUserPayload {
  full_name?: string;
  phone?: string;
  is_active?: boolean;
  role?: string;
}

// ─── Admin Order Management Types ──────────────────────────────────────────

export type AdminOrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "DELIVERING"
  | "COMPLETED"
  | "CANCELLED";

export interface AdminOrderDetailItem {
  id: string;
  purchase_order: string;
  plant_detail: string;
  plant_name?: string;
  plant_sku?: string;
  plant_size?: string;
  primary_image?: string | null;
  plant_detail_info?: unknown;
  quantity: number;
  unit_price: number | string;
  total_price: number | string;
  created_at?: string;
  updated_at?: string;
}

export interface AdminOrder {
  id: string;
  order_code: string;
  user: string;
  user_email: string;
  user_name?: string;
  user_phone?: string;
  total_amount: number | string;
  status: AdminOrderStatus;
  status_display?: string;
  shipping_address: string;
  recipient_name: string;
  recipient_phone: string;
  notes?: string;
  items_count?: number;
  details?: AdminOrderDetailItem[];
  created_at: string;
  updated_at: string;
}

export interface AdminOrderQueryParams {
  search?: string;
  status?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface UpdateAdminOrderStatusPayload {
  status: AdminOrderStatus;
  notes?: string;
}
