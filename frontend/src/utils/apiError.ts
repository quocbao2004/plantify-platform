import { isAxiosError } from "axios";
import { MESSAGES } from "@/constants/messages";

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined;
}

export function getApiFieldErrors(error: unknown): Record<string, string> {
  if (!isAxiosError(error) || !error.response || error.response.status >= 500) return {};
  const data = asRecord(error.response.data);
  if (!data) return {};
  const envelope = asRecord(data.error);
  const details = asRecord(envelope?.details) ?? asRecord(data.errors) ?? data;
  const fields: Record<string, string> = {};
  for (const [key, value] of Object.entries(details)) {
    const message = Array.isArray(value) ? value.find((item) => typeof item === "string") : value;
    if (typeof message === "string" && message.trim()) fields[key] = message;
  }
  return fields;
}

export function getApiErrorMessage(
  error: unknown,
  fallback: string = MESSAGES.UNEXPECTED_ERROR,
): string {
  if (!isAxiosError(error)) return fallback;
  if (!error.response) return MESSAGES.NETWORK_ERROR;
  if (error.response.status >= 500) return MESSAGES.SERVER_ERROR;
  const data: unknown = error.response.data;
  if (!data || typeof data !== "object") return fallback;
  const envelope = asRecord(asRecord(data)?.error);
  if (envelope) {
    const fieldMessage = Object.values(getApiFieldErrors(error))[0];
    if (fieldMessage) return fieldMessage;
    if (typeof envelope.message === "string" && envelope.message.trim()) return envelope.message;
  }
  for (const key of ["detail", "message", "error"]) {
    const message = (data as Record<string, unknown>)[key];
    if (typeof message === "string" && message.trim()) return message;
  }
  return fallback;
}
