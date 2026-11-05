import React from "react";

import { TextFieldCommon } from "@/components/common/TextFieldCommon";
import { ButtonCommon } from "@/components/common/ButtonCommon";
import { FormCommon } from "@/components/common/FormCommon";
import { LinkCommon } from "@/components/common/LinkCommon";
import { CheckboxCommon } from "@/components/common/CheckboxCommon";
import { LABELS } from "@/constants/labels";
import { useLoginForm } from "../hooks/useLoginForm";

import { AuthLayout } from "../components/AuthLayout";

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

export const LoginPage: React.FC = () => {
  const {
    email, setEmail,
    password, setPassword,
    fieldErrors,
    showPassword, setShowPassword,
    rememberMe, setRememberMe,
    isLoginPending,
    isSocialPending,
    socialLoadingProvider,
    handleSubmit,
    handleGoogleLogin,
  } = useLoginForm();

  return (
    <AuthLayout headingId="login-heading">
          <div className="text-center mb-8">
            <h1
              id="login-heading"
              className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark mb-2"
            >
              {LABELS.auth.LOGIN_TITLE}
            </h1>
            <p className="text-xs sm:text-sm text-surface-500">
              {LABELS.auth.LOGIN_DESCRIPTION}
            </p>
          </div>

          <FormCommon
            aria-label={LABELS.auth.LOGIN_TITLE}
            noValidate
            isSubmitting={isLoginPending}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <TextFieldCommon
              label={LABELS.auth.EMAIL}
              hideLabel
              variant="filled"
              type="email"
              autoComplete="email"
              placeholder={LABELS.auth.EMAIL_OR_PHONE_PLACEHOLDER}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={fieldErrors.email}
            />

            <TextFieldCommon
              label={LABELS.auth.PASSWORD}
              hideLabel
              variant="filled"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder={LABELS.auth.PASSWORD}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={fieldErrors.password}
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
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <CheckboxCommon
                label={LABELS.auth.REMEMBER_ME}
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
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
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
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
                isLoading={isSocialPending && socialLoadingProvider === "GOOGLE"}
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
    </AuthLayout>
  );
};

export default LoginPage;
