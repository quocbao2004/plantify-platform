import { BaseEntity } from "./api";

export type UserRole = "CUSTOMER" | "STAFF" | "ADMIN";

export interface User extends BaseEntity {
  email: string;
  full_name?: string;
  phone_number?: string;
  avatar_url?: string;
  role: UserRole;
  is_active: boolean;
  is_verified?: boolean;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}
