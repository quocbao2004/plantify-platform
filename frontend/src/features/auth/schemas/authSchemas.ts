import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Vui lòng nhập email").email("Định dạng email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    full_name: z.string().min(2, "Họ và tên tối thiểu 2 ký tự"),
    email: z.string().min(1, "Vui lòng nhập email").email("Định dạng email không hợp lệ"),
    phone_number: z
      .string()
      .regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, "Số điện thoại Việt Nam không hợp lệ")
      .optional()
      .or(z.literal("")),
    password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
    confirm_password: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Mật khẩu xác nhận không trùng khớp",
    path: ["confirm_password"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
