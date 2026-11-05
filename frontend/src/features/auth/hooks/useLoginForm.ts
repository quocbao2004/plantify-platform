import React, { useState } from "react";

import { notify } from "@/services/notifications";
import { VALIDATION_MESSAGES } from "@/constants/messages";
import { env } from "@/config/env";
import { triggerGoogleLogin } from "@/services/socialAuth";
import { loginSchema } from "../schemas/authSchemas";
import { useLogin, useSocialLogin } from "./useAuth";

export const useLoginForm = () => {
  const { mutate: login, isPending: isLoginPending } = useLogin();
  const { mutate: socialLogin, isPending: isSocialPending } = useSocialLogin();

  const [socialLoadingProvider, setSocialLoadingProvider] = useState<
    "GOOGLE" | null
  >(null);

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const errs = result.error.flatten().fieldErrors;
      setFieldErrors({
        email: errs.email?.[0],
        password: errs.password?.[0],
      });
      notify.error(
        errs.email?.[0] ?? errs.password?.[0] ?? VALIDATION_MESSAGES.INVALID_FORM,
        { id: "form-validation" },
      );
      return;
    }

    try {
      login(result.data, {
        onSettled: () => setFieldErrors({}),
      });
    } catch (err: any) {
      notify.error(err.message || "Đăng nhập thất bại.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setSocialLoadingProvider("GOOGLE");
      const token = await triggerGoogleLogin(env.VITE_GOOGLE_CLIENT_ID);
      socialLogin(
        { provider: "GOOGLE", access_token: token },
        {
          onSettled: () => setSocialLoadingProvider(null),
        },
      );
    } catch (err: any) {
      setSocialLoadingProvider(null);
      notify.error(err.message || "Đăng nhập Google thất bại.");
    }
  };

  return {
    // Form values
    email,
    setEmail,
    password,
    setPassword,
    fieldErrors,
    // UI state
    showPassword,
    setShowPassword,
    rememberMe,
    setRememberMe,
    // Loading state
    isLoginPending,
    isSocialPending,
    socialLoadingProvider,
    // Handlers
    handleSubmit,
    handleGoogleLogin,
  };
};
