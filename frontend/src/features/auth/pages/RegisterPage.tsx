import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Sprout } from "lucide-react";
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui";
import { registerSchema, RegisterFormValues } from "../schemas/authSchemas";
import { useRegister } from "../hooks/useAuth";

export const RegisterPage: React.FC = () => {
  const { mutate: registerUser, isPending, error } = useRegister();

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
          <CardTitle className="text-xl">Tạo tài khoản mới</CardTitle>
          <CardDescription>Tham gia Plantify để mua và thuê cây cảnh nhanh chóng</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-3">
            {error && (
              <div className="p-3 rounded bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
                Đăng ký không thành công. Email này có thể đã được sử dụng.
              </div>
            )}

            <Input
              label="Họ và tên"
              placeholder="Nguyễn Văn A"
              error={errors.full_name?.message}
              {...register("full_name")}
            />

            <Input
              label="Địa chỉ Email"
              type="email"
              placeholder="ten@vidu.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Số điện thoại (tùy chọn)"
              placeholder="0912345678"
              error={errors.phone_number?.message}
              {...register("phone_number")}
            />

            <Input
              label="Mật khẩu"
              type="password"
              placeholder="Tối thiểu 8 ký tự"
              error={errors.password?.message}
              {...register("password")}
            />

            <Input
              label="Xác nhận mật khẩu"
              type="password"
              placeholder="Nhập lại mật khẩu"
              error={errors.confirm_password?.message}
              {...register("confirm_password")}
            />
          </CardContent>

          <CardFooter className="flex-col gap-3">
            <Button type="submit" variant="primary" className="w-full" isLoading={isPending}>
              Tạo tài khoản
            </Button>
            <p className="text-xs text-surface-500 text-center">
              Đã có tài khoản?{" "}
              <Link to="/login" className="font-semibold text-accent-700 hover:underline">
                Đăng nhập
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
