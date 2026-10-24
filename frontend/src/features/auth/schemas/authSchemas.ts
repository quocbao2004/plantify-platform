import { VALIDATION_MESSAGES } from "@/constants/messages";
import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, VALIDATION_MESSAGES.EMAIL_REQUIRED)
    .email(VALIDATION_MESSAGES.EMAIL_INVALID),
  password: z.string().min(6, VALIDATION_MESSAGES.PASSWORD_LOGIN_MIN),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    full_name: z.string().min(2, VALIDATION_MESSAGES.NAME_MIN),
    email: z
      .string()
      .min(1, VALIDATION_MESSAGES.EMAIL_REQUIRED)
      .email(VALIDATION_MESSAGES.EMAIL_INVALID),
    phone_number: z
      .string()
      .regex(
        /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
        VALIDATION_MESSAGES.PHONE_INVALID,
      )
      .optional()
      .or(z.literal("")),
    password: z.string().min(8, VALIDATION_MESSAGES.PASSWORD_REGISTER_MIN),
    confirm_password: z
      .string()
      .min(1, VALIDATION_MESSAGES.PASSWORD_CONFIRM_REQUIRED),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: VALIDATION_MESSAGES.PASSWORD_MISMATCH,
    path: ["confirm_password"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
