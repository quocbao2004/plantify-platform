import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Sprout } from "lucide-react";
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui";
import { loginSchema, LoginFormValues } from "../schemas/authSchemas";
import { useLogin } from "../hooks/useAuth";

export const LoginPage: React.FC = () => {
  const { mutate: login, isPending, error } = useLogin();

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
          <CardTitle className="text-xl">Đăng nhập Plantify</CardTitle>
          <CardDescription>Nhập thông tin tài khoản để truy cập hệ thống</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 rounded bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
                Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.
              </div>
            )}

            <Input
              label="Địa chỉ Email"
              type="email"
              placeholder="ten@vidu.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Mật khẩu"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />
          </CardContent>

          <CardFooter className="flex-col gap-3">
            <Button type="submit" variant="primary" className="w-full" isLoading={isPending}>
              Đăng nhập
            </Button>
            <p className="text-xs text-surface-500 text-center">
              Chưa có tài khoản?{" "}
              <Link to="/register" className="font-semibold text-accent-700 hover:underline">
                Đăng ký ngay
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
