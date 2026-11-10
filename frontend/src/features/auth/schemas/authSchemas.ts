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
    full_name: z.string().trim().min(2, VALIDATION_MESSAGES.NAME_MIN).max(255, VALIDATION_MESSAGES.NAME_MAX),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, VALIDATION_MESSAGES.EMAIL_REQUIRED)
      .email(VALIDATION_MESSAGES.EMAIL_INVALID)
      .max(254, VALIDATION_MESSAGES.EMAIL_MAX),
    phone_number: z
      .string()
      .trim()
      .min(1, VALIDATION_MESSAGES.PHONE_REQUIRED)
      .regex(
        /^(?:0[35789]\d{8}|\+?84[35789]\d{8})$/,
        VALIDATION_MESSAGES.PHONE_INVALID,
      ),
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
