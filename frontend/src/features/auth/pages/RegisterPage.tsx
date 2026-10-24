import { TextFieldCommon } from "@/components/common/TextFieldCommon";
import { notifyFormErrors } from "@/utils/formErrors";
import { ButtonCommon } from "@/components/common/ButtonCommon";
import { FormCommon } from "@/components/common/FormCommon";
import { LinkCommon } from "@/components/common/LinkCommon";
import { LABELS } from "@/constants/labels";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Sprout } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui";
import { registerSchema, RegisterFormValues } from "../schemas/authSchemas";
import { useRegister } from "../hooks/useAuth";

export const RegisterPage: React.FC = () => {
  const { mutate: registerUser, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
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

  const onSubmit = (values: RegisterFormValues) => {
    registerUser({
      full_name: values.full_name,
      email: values.email,
      phone_number: values.phone_number || undefined,
      password: values.password,
    });
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center space-y-2">
          <div className="w-10 h-10 rounded bg-accent-600 text-white flex items-center justify-center mx-auto mb-2">
            <Sprout className="w-6 h-6" />
          </div>
          <CardTitle className="text-xl">
            {LABELS.auth.REGISTER_TITLE}
          </CardTitle>
          <CardDescription>{LABELS.auth.REGISTER_DESCRIPTION}</CardDescription>
        </CardHeader>

        <FormCommon
          aria-label={LABELS.auth.REGISTER_TITLE}
          noValidate
          isSubmitting={isPending}
          onSubmit={handleSubmit(onSubmit, notifyFormErrors)}
        >
          <CardContent className="space-y-3">
            <TextFieldCommon
              label={LABELS.auth.FULL_NAME}
              placeholder={LABELS.auth.NAME_PLACEHOLDER}
              error={errors.full_name?.message}
              {...register("full_name")}
            />

            <TextFieldCommon
              label={LABELS.auth.EMAIL}
              type="email"
              autoComplete="email"
              placeholder={LABELS.auth.EMAIL_PLACEHOLDER}
              error={errors.email?.message}
              {...register("email")}
            />

            <TextFieldCommon
              label={LABELS.auth.PHONE_OPTIONAL}
              placeholder={LABELS.auth.PHONE_PLACEHOLDER}
              error={errors.phone_number?.message}
              {...register("phone_number")}
            />

            <TextFieldCommon
              label={LABELS.auth.PASSWORD}
              type="password"
              autoComplete="new-password"
              placeholder={LABELS.auth.NEW_PASSWORD_PLACEHOLDER}
              error={errors.password?.message}
              {...register("password")}
            />

            <TextFieldCommon
              label={LABELS.auth.CONFIRM_PASSWORD}
              type="password"
              autoComplete="new-password"
              placeholder={LABELS.auth.CONFIRM_PASSWORD_PLACEHOLDER}
              error={errors.confirm_password?.message}
              {...register("confirm_password")}
            />
          </CardContent>

          <CardFooter className="flex-col gap-3">
            <ButtonCommon
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isPending}
            >
              {LABELS.auth.CREATE_ACCOUNT}
            </ButtonCommon>
            <p className="text-xs text-surface-500 text-center">
              {LABELS.auth.HAVE_ACCOUNT}{" "}
              <LinkCommon
                to="/login"
                className="font-semibold text-accent-700 hover:underline"
              >
                {LABELS.navigation.LOGIN}
              </LinkCommon>
            </p>
          </CardFooter>
        </FormCommon>
      </Card>
    </div>
  );
};
