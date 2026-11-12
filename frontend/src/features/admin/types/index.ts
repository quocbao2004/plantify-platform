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

// ─── Admin Plant Management Types ──────────────────────────────────────────

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
  sort_order?: number;
}

export interface AdminPlantDetailItem {
  id: string;
  sku: string;
  size?: string;
  height?: number | string | null;
  sale_price?: number | string | null;
  rental_price?: number | string | null;
  stock_quantity: number;
  status: string;
  description?: string;
  media?: Array<{
    id: string;
    file_url: string;
    is_primary: boolean;
  }>;
}

export interface AdminPlant {
  id: string;
  category: string;
  category_name?: string;
  name: string;
  slug: string;
  description?: string;
  care_guide?: string;
  is_active: boolean;
  details?: AdminPlantDetailItem[];
  primary_image?: string | null;
  images?: Array<{
    id: string;
    image: string;
    is_primary: boolean;
    sort_order: number;
  }>;
  sale_price?: number;
  rental_price?: number;
  created_at: string;
  updated_at: string;
}

export interface AdminPlantQueryParams {
  search?: string;
  category?: string;
  is_active?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface CreateAdminPlantPayload {
  name: string;
  category: string;
  description?: string;
  care_guide?: string;
  is_active?: boolean;
  primary_image?: string;
  sale_price?: number;
  rental_price?: number;
  stock_quantity?: number;
}

export interface UpdateAdminPlantPayload {
  name?: string;
  category?: string;
  description?: string;
  care_guide?: string;
  is_active?: boolean;
  primary_image?: string;
  sale_price?: number;
  rental_price?: number;
  stock_quantity?: number;
}


// ─── Admin Return/Exchange Management Types ────────────────────────────────

export type AdminReturnStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "COMPLETED"
  | "CANCELLED";

export type AdminReturnType =
  | "EXCHANGE"
  | "REFUND"
  | "CARE_SUPPORT";

export type AdminReturnReason =
  | "DAMAGED_TRANSIT"
  | "WRONG_ITEM"
  | "DISEASE_14D"
  | "NOT_AS_DESCRIBED"
  | "OTHER";

export interface AdminReturnRequest {
  id: string;
  return_code: string;
  order: string;
  order_code: string;
  order_detail?: string | null;
  plant_name?: string;
  plant_sku?: string;
  plant_size?: string;
  plant_image?: string | null;
  user: string;
  user_name?: string;
  user_email?: string;
  user_phone?: string;
  request_type: AdminReturnType;
  request_type_display?: string;
  reason: AdminReturnReason;
  reason_display?: string;
  status: AdminReturnStatus;
  status_display?: string;
  quantity: number;
  refund_amount: number | string;
  customer_notes?: string;
  proof_images?: string[];
  admin_notes?: string;
  resolution_action?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminReturnQueryParams {
  search?: string;
  status?: string;
  request_type?: string;
  reason?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface UpdateAdminReturnPayload {
  status: AdminReturnStatus;
  admin_notes?: string;
  resolution_action?: string;
  refund_amount?: number;
}
