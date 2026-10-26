import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import { useAuthStore } from "@/stores/authStore";
import { LoginPayload, RegisterPayload } from "../types";
import { MESSAGES } from "@/constants/messages";
import { notify } from "@/services/notifications";

export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    meta: {
      successMessage: MESSAGES.LOGIN_SUCCESS,
      errorMessage: MESSAGES.LOGIN_ERROR,
    },
    onSuccess: (data: any) => {
      const user = data.user || data.data?.user;
      const tokens = data.tokens || data.data?.tokens;
      if (user && tokens) {
        setAuth(user, tokens);
      }
      navigate("/");
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    meta: {
      successMessage: MESSAGES.REGISTER_SUCCESS,
      errorMessage: MESSAGES.REGISTER_ERROR,
    },
    onSuccess: (data: any) => {
      const user = data.user || data.data?.user;
      const tokens = data.tokens || data.data?.tokens;
      if (user && tokens) {
        setAuth(user, tokens);
      }
      navigate("/");
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);

  return () => {
    logout();
    queryClient.clear();
    notify.success(MESSAGES.LOGOUT_SUCCESS);
    navigate("/login");
  };
};
