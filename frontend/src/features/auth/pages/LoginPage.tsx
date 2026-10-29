import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { TextFieldCommon } from "@/components/common/TextFieldCommon";
import { ButtonCommon } from "@/components/common/ButtonCommon";
import { FormCommon } from "@/components/common/FormCommon";
import { LinkCommon } from "@/components/common/LinkCommon";
import { LABELS } from "@/constants/labels";
import { notify } from "@/services/notifications";
import { notifyFormErrors } from "@/utils/formErrors";
import { env } from "@/config/env";
import { triggerGoogleLogin} from "@/services/socialAuth";
import { loginSchema, LoginFormValues } from "../schemas/authSchemas";
import { useLogin, useSocialLogin } from "../hooks/useAuth";

const GoogleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);


const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

const HomeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export const LoginPage: React.FC = () => {
  const { mutate: login, isPending: isLoginPending } = useLogin();
  const { mutate: socialLogin, isPending: isSocialPending } = useSocialLogin();
  const [socialLoadingProvider, setSocialLoadingProvider] = useState<
    "GOOGLE"| null
  >(null);

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    login(values);
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


  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white">
      {/* Left visual column */}
      <section
        className="relative hidden lg:flex lg:w-1/2 flex-col justify-end min-h-screen overflow-hidden"
        aria-label={LABELS.home.HERO_EYEBROW}
      >
        <img
          src="/images/home/hero-living-room.webp"
          alt={LABELS.home.HERO_ALT}
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
        />
        {/* Soft green gradient fading up to make text stand out */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0e2518] via-[#0e2518]/70 via-35% to-transparent to-70%"
          aria-hidden="true"
        />

        <div className="relative z-10 p-12 lg:p-16 text-white max-w-xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-white/70" aria-hidden="true" />
            <span className="text-xs font-semibold tracking-wider uppercase text-white/90">
              {LABELS.auth.HERO_EYEBROW}
            </span>
          </div>

          <h1 className="font-serif text-3xl xl:text-4xl leading-snug font-normal mb-3 text-white">
            {LABELS.home.HERO_TITLE_FIRST}
            <br />
            {LABELS.home.HERO_TITLE_SECOND}
          </h1>

          <p className="text-sm text-white/80 max-w-sm font-light leading-relaxed">
            {LABELS.auth.HERO_SUBTITLE}
          </p>
        </div>
      </section>

      {/* Right form column */}
      <section
        className="flex-1 flex flex-col justify-between min-h-screen p-6 sm:p-10 lg:p-12 xl:p-16 bg-white"
        aria-labelledby="login-heading"
      >
        {/* Top Header with Home Button */}
        <div className="flex items-center justify-between pt-2 pb-6 w-full">
          <LinkCommon
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand/20 bg-brand/5 text-brand hover:bg-brand/10 hover:border-brand/40 transition-all duration-200 text-sm font-medium"
            aria-label={LABELS.navigation.BRAND_HOME}
          >
            <HomeIcon className="w-4 h-4 text-brand" aria-hidden="true" />
            <span>{LABELS.navigation.HOME}</span>
          </LinkCommon>

          {/* Spacer to keep brand logo visually centered */}
          <div className="w-20 hidden sm:block" aria-hidden="true" />
        </div>

        {/* Form Container */}
        <div className="w-full max-w-sm sm:max-w-md mx-auto my-auto py-4">
          <div className="text-center mb-8">
            <h2
              id="login-heading"
              className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark mb-2"
            >
              {LABELS.auth.LOGIN_TITLE}
            </h2>
            <p className="text-xs sm:text-sm text-surface-500">
              {LABELS.auth.LOGIN_DESCRIPTION}
            </p>
          </div>

          <FormCommon
            aria-label={LABELS.auth.LOGIN_TITLE}
            noValidate
            isSubmitting={isLoginPending}
            onSubmit={handleSubmit(onSubmit, notifyFormErrors)}
            className="space-y-4"
          >
            <TextFieldCommon
              label={LABELS.auth.EMAIL}
              hideLabel
              variant="filled"
              type="email"
              autoComplete="email"
              placeholder={LABELS.auth.EMAIL_OR_PHONE_PLACEHOLDER}
              error={errors.email?.message}
              {...register("email")}
            />

            <TextFieldCommon
              label={LABELS.auth.PASSWORD}
              hideLabel
              variant="filled"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder={LABELS.auth.PASSWORD}
              error={errors.password?.message}
              rightElement={
                <ButtonCommon
                  type="button"
                  variant="ghost"
                  size="unstyled"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-surface-400 hover:text-surface-600 transition-colors focus:outline-none"
                  aria-label={
                    showPassword
                      ? LABELS.auth.HIDE_PASSWORD
                      : LABELS.auth.SHOW_PASSWORD
                  }
                >
                  {showPassword ? (
                    <EyeOffIcon className="w-4 h-4" />
                  ) : (
                    <EyeIcon className="w-4 h-4" />
                  )}
                </ButtonCommon>
              }
              {...register("password")}
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-surface-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-surface-300 text-brand focus:ring-brand h-3.5 w-3.5"
                />
                <span>{LABELS.auth.REMEMBER_ME}</span>
              </label>

              <LinkCommon
                to="/forgot-password"
                className="text-surface-500 hover:text-brand transition-colors"
              >
                {LABELS.auth.FORGOT_PASSWORD}
              </LinkCommon>
            </div>

            <ButtonCommon
              type="submit"
              variant="brand"
              className="w-full h-11 rounded font-medium mt-2"
              isLoading={isLoginPending}
            >
              {LABELS.navigation.LOGIN}
            </ButtonCommon>

            <div className="relative my-6 text-center">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-surface-200" />
              </div>
              <span className="relative bg-white px-3 text-xs text-surface-400">
                {LABELS.auth.OR_CONTINUE_WITH}
              </span>
            </div>

            <div className="flex justify-center">
              <ButtonCommon
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                isLoading={
                  isSocialPending && socialLoadingProvider === "GOOGLE"
                }
                disabled={isLoginPending || isSocialPending}
                className="w-full h-10 border border-surface-200 hover:bg-surface-50 text-surface-700 text-xs font-medium rounded flex items-center justify-center gap-2"
                aria-label={LABELS.auth.GOOGLE}
              >
                <GoogleIcon className="w-4 h-4" />
                <span>{LABELS.auth.GOOGLE}</span>
              </ButtonCommon>
            </div>

            <p className="text-xs text-surface-500 text-center mt-6">
              {LABELS.auth.NO_ACCOUNT}{" "}
              <LinkCommon
                to="/register"
                className="font-semibold text-brand hover:underline"
              >
                {LABELS.auth.REGISTER_NOW}
              </LinkCommon>
            </p>
          </FormCommon>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 pb-2 text-center">
          <p className="text-[11px] text-surface-400">
            {LABELS.auth.COPYRIGHT_TEXT}
          </p>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
