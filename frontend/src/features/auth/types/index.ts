import { User, AuthTokens } from "@/types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
  phone_number?: string;
}

export interface SocialLoginPayload {
  provider: "GOOGLE" | "FACEBOOK";
  access_token?: string;
  id_token?: string;
  auth_token?: string;
  code?: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}
