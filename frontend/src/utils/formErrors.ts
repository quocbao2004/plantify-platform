import type { FieldErrors, FieldValues } from "react-hook-form";
import { VALIDATION_MESSAGES } from "@/constants/messages";
import { notify } from "@/services/notifications";

export function notifyFormErrors<T extends FieldValues>(
  errors: FieldErrors<T>,
) {
  const firstError = Object.values(errors).find(
    (error) => error && typeof error.message === "string",
  );
  notify.error(
    typeof firstError?.message === "string"
      ? firstError.message
      : VALIDATION_MESSAGES.INVALID_FORM,
    { id: "form-validation" },
  );
}
