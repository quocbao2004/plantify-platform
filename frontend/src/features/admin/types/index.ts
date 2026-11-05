import { UserRole } from "@/types";

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  phone: string;
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
  is_active?: boolean;
  role?: string;
}
