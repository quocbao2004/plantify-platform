import { httpClient } from "@/services/api";
import { API_ENDPOINTS } from "@/constants";
import {
  LoginPayload,
  RegisterPayload,
  SocialLoginPayload,
  AuthResponse,
} from "../types";
import { User } from "@/types";

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await httpClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      payload,
    );
    return data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await httpClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      payload,
    );
    return data;
  },

  socialLogin: async (payload: SocialLoginPayload): Promise<AuthResponse> => {
    const { data } = await httpClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.SOCIAL_LOGIN,
      payload,
    );
    return data;
  },

  googleLogin: async (
    tokenOrPayload: string | { access_token?: string; id_token?: string },
  ): Promise<AuthResponse> => {
    const payload =
      typeof tokenOrPayload === "string"
        ? { provider: "google", access_token: tokenOrPayload }
        : { provider: "google", ...tokenOrPayload };
    const { data } = await httpClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.SOCIAL_GOOGLE,
      payload,
    );
    return data;
  },

  getMe: async (): Promise<User> => {
    const { data } = await httpClient.get<User>(API_ENDPOINTS.AUTH.ME);
    return data;
  },
};
