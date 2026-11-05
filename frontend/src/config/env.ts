import { z } from "zod";

const envSchema = z.object({
  VITE_APP_NAME: z.string().default("Plantify"),
  VITE_APP_ENV: z.enum(["development", "test", "production"]).default("development"),
  VITE_API_BASE_URL: z.string().url().default("http://localhost:8001/api/v1"),
  VITE_API_TIMEOUT: z.coerce.number().default(15000),
  VITE_GOOGLE_CLIENT_ID: z.string().optional().default(""),
  VITE_FACEBOOK_APP_ID: z.string().optional().default(""),
});

const parseEnv = () => {
  const result = envSchema.safeParse(import.meta.env);

  if (!result.success) {
    // eslint-disable-next-line no-console
    console.error("❌ Biến môi trường không hợp lệ:", result.error.format());
    throw new Error("Cấu hình biến môi trường không hợp lệ.");
  }

  return result.data;
};

export const env = parseEnv();
