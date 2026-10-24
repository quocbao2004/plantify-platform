import { isAxiosError } from "axios";
import { MESSAGES } from "@/constants/messages";

export function getApiErrorMessage(
  error: unknown,
  fallback: string = MESSAGES.UNEXPECTED_ERROR,
): string {
  if (!isAxiosError(error)) return fallback;
  if (!error.response) return MESSAGES.NETWORK_ERROR;
  if (error.response.status >= 500) return MESSAGES.SERVER_ERROR;
  const data: unknown = error.response.data;
  if (!data || typeof data !== "object") return fallback;
  for (const key of ["detail", "message", "error"]) {
    const message = (data as Record<string, unknown>)[key];
    if (typeof message === "string" && message.trim()) return message;
  }
  return fallback;
}
