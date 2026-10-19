import { httpClient } from "@/services/api";
import { API_ENDPOINTS } from "@/constants";
import { LoginPayload, RegisterPayload, AuthResponse } from "../types";
import { User } from "@/types";

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await httpClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, payload);
    return data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await httpClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, payload);
    return data;
  },

  getMe: async (): Promise<User> => {
    const { data } = await httpClient.get<User>(API_ENDPOINTS.AUTH.ME);
    return data;
  },
};
