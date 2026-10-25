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
import { loginSchema, LoginFormValues } from "../schemas/authSchemas";
import { useLogin } from "../hooks/useAuth";

export const LoginPage: React.FC = () => {
  const { mutate: login, isPending } = useLogin();

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

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center space-y-2">
          <div className="w-10 h-10 rounded bg-accent-600 text-white flex items-center justify-center mx-auto mb-2">
            <Sprout className="w-6 h-6" />
          </div>
          <CardTitle className="text-xl">{LABELS.auth.LOGIN_TITLE}</CardTitle>
          <CardDescription>{LABELS.auth.LOGIN_DESCRIPTION}</CardDescription>
        </CardHeader>

        <FormCommon
          aria-label={LABELS.auth.LOGIN_TITLE}
          noValidate
          isSubmitting={isPending}
          onSubmit={handleSubmit(onSubmit, notifyFormErrors)}
        >
          <CardContent className="space-y-4">
            <TextFieldCommon
              label={LABELS.auth.EMAIL}
              type="email"
              autoComplete="email"
              placeholder={LABELS.auth.EMAIL_PLACEHOLDER}
              error={errors.email?.message}
              {...register("email")}
            />

            <TextFieldCommon
              label={LABELS.auth.PASSWORD}
              type="password"
              autoComplete="current-password"
              placeholder={LABELS.auth.PASSWORD_PLACEHOLDER}
              error={errors.password?.message}
              {...register("password")}
            />
          </CardContent>

          <CardFooter className="flex-col gap-3">
            <ButtonCommon
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isPending}
            >
              {LABELS.navigation.LOGIN}
            </ButtonCommon>
            <p className="text-xs text-surface-500 text-center">
              {LABELS.auth.NO_ACCOUNT}{" "}
              <LinkCommon
                to="/register"
                className="font-semibold text-accent-700 hover:underline"
              >
                {LABELS.auth.REGISTER_NOW}
              </LinkCommon>
            </p>
          </CardFooter>
        </FormCommon>
      </Card>
    </div>
  );
};
