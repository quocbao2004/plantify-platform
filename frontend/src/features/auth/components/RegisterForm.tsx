import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { TextFieldCommon } from "@/components/common/TextFieldCommon";
import { ButtonCommon } from "@/components/common/ButtonCommon";
import { FormCommon } from "@/components/common/FormCommon";
import { LinkCommon } from "@/components/common/LinkCommon";
import { LABELS } from "@/constants/labels";
import { MESSAGES } from "@/constants/messages";
import { getApiErrorMessage, getApiFieldErrors } from "@/utils/apiError";
import { notifyFormErrors } from "@/utils/formErrors";
import { registerSchema, type RegisterFormValues } from "../schemas/authSchemas";
import { useRegister } from "../hooks/useAuth";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import { PasswordField } from "./PasswordField";
import { SocialAuthButtons } from "./SocialAuthButtons";

export function RegisterForm() {
  const { mutateAsync: registerUser, isPending } = useRegister();
  const { isPending: isGooglePending, handleGoogleLogin } = useGoogleAuth();
  const inFlight = useRef(false);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone_number: "",
      password: "",
      confirm_password: "",
    },
  });
  const busy = isPending || isSubmitting || isGooglePending;

  const onSubmit = async (values: RegisterFormValues) => {
    if (inFlight.current || isGooglePending) return;
    inFlight.current = true;
    clearErrors();
    try {
      await registerUser({
        full_name: values.full_name,
        email: values.email,
        phone_number: values.phone_number || undefined,
        password: values.password,
      });
    } catch (error) {
      const fields = getApiFieldErrors(error);
      const fieldMap = {
        full_name: "full_name",
        email: "email",
        phone: "phone_number",
        phone_number: "phone_number",
        password: "password",
      } as const;
      let hasFieldError = false;
      for (const [key, field] of Object.entries(fieldMap)) {
        if (fields[key]) {
          setError(field, { type: "server", message: fields[key] }, { shouldFocus: !hasFieldError });
          hasFieldError = true;
        }
      }
      if (!hasFieldError) {
        const message = getApiErrorMessage(error, MESSAGES.REGISTER_ERROR);
        if (isAxiosError(error) && error.response?.status === 409) {
          setError("email", { type: "server", message }, { shouldFocus: true });
        } else {
          setError("root.server", { type: "server", message });
        }
      }
    } finally {
      inFlight.current = false;
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h1 id="register-heading" className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark mb-2">
          {LABELS.auth.REGISTER_TITLE}
        </h1>
        <p className="text-xs sm:text-sm text-surface-500">{LABELS.auth.REGISTER_DESCRIPTION}</p>
      </div>
      <FormCommon
        aria-label={LABELS.auth.REGISTER_TITLE}
        noValidate
        isSubmitting={busy}
        onSubmit={handleSubmit(onSubmit, notifyFormErrors)}
        className="space-y-4"
      >
        <fieldset disabled={busy} className="space-y-4 min-w-0">
          <TextFieldCommon
            label={LABELS.auth.FULL_NAME}
            hideLabel
            variant="filled"
            autoComplete="name"
            maxLength={255}
            placeholder={LABELS.auth.NAME_PLACEHOLDER}
            error={errors.full_name?.message}
            {...register("full_name")}
          />
          <TextFieldCommon
            label={LABELS.auth.EMAIL}
            hideLabel
            variant="filled"
            type="email"
            autoComplete="email"
            maxLength={254}
            placeholder={LABELS.auth.EMAIL_PLACEHOLDER}
            error={errors.email?.message}
            {...register("email")}
          />
          <TextFieldCommon
            label={LABELS.auth.PHONE_OPTIONAL}
            hideLabel
            variant="filled"
            type="tel"
            autoComplete="tel"
            maxLength={20}
            placeholder={LABELS.auth.PHONE_PLACEHOLDER}
            error={errors.phone_number?.message}
            {...register("phone_number")}
          />
          <PasswordField
            label={LABELS.auth.PASSWORD}
            hideLabel
            variant="filled"
            autoComplete="new-password"
            placeholder={LABELS.auth.NEW_PASSWORD_PLACEHOLDER}
            error={errors.password?.message}
            {...register("password")}
          />
          <PasswordField
            label={LABELS.auth.CONFIRM_PASSWORD}
            confirmation
            hideLabel
            variant="filled"
            autoComplete="new-password"
            placeholder={LABELS.auth.CONFIRM_PASSWORD_PLACEHOLDER}
            error={errors.confirm_password?.message}
            {...register("confirm_password")}
          />
          {errors.root?.server ? <p role="alert" className="text-sm text-red-600">{errors.root.server.message}</p> : null}
          <ButtonCommon
            type="submit"
            variant="brand"
            className="w-full h-11 rounded font-medium mt-2"
            isLoading={isPending}
            disabled={busy}
          >
            {LABELS.auth.CREATE_ACCOUNT}
          </ButtonCommon>
        </fieldset>
        <SocialAuthButtons onGoogleClick={handleGoogleLogin} isLoading={isGooglePending} disabled={busy} />
        <p className="text-xs text-surface-500 text-center mt-6">
          {LABELS.auth.HAVE_ACCOUNT}{" "}
          <LinkCommon to="/login" className="font-semibold text-brand hover:underline">{LABELS.navigation.LOGIN}</LinkCommon>
        </p>
      </FormCommon>
    </>
  );
}
