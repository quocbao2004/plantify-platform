import { httpClient } from "@/services/api";
import { API_ENDPOINTS } from "@/constants";
import {
  LoginPayload,
  RegisterPayload,
  SocialLoginPayload,
  AuthResponse,
} from "../types";
import { User } from "@/types";
import { MESSAGES } from "@/constants/messages";

type AuthApiData = Omit<AuthResponse, "user"> & { user: User & { phone?: string } };

function readAuthResponse(response: AuthApiData | { data: AuthApiData }): AuthResponse {
  if (!response || typeof response !== "object") {
    throw new Error(MESSAGES.INVALID_API_RESPONSE);
  }
  const payload = "data" in response ? response.data : response;
  if (!payload?.user?.id || typeof payload.tokens?.access !== "string" || !payload.tokens.access || typeof payload.tokens?.refresh !== "string" || !payload.tokens.refresh) {
    throw new Error(MESSAGES.INVALID_API_RESPONSE);
  }
  return {
    user: { ...payload.user, phone_number: payload.user.phone ?? payload.user.phone_number },
    tokens: payload.tokens,
  };
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await httpClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      payload,
    );
    return readAuthResponse(data);
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { phone_number, ...fields } = payload;
    const { data } = await httpClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      { ...fields, phone: phone_number ?? "" },
    );
    return readAuthResponse(data);
  },

  socialLogin: async (payload: SocialLoginPayload): Promise<AuthResponse> => {
    const { data } = await httpClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.SOCIAL_LOGIN,
      payload,
    );
    return readAuthResponse(data);
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
    return readAuthResponse(data);
  },

  getMe: async (): Promise<User> => {
    const { data } = await httpClient.get<User>(API_ENDPOINTS.AUTH.ME);
    return data;
  },
};
