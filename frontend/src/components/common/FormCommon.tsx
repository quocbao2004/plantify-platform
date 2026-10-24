import {
  forwardRef,
  useId,
  type FormHTMLAttributes,
  type FormEvent,
} from "react";
import { VALIDATION_MESSAGES } from "@/constants/messages";
import { notify } from "@/services/notifications";

export interface FormCommonProps extends FormHTMLAttributes<HTMLFormElement> {
  isSubmitting?: boolean;
  showValidationToast?: boolean;
}

export const FormCommon = forwardRef<HTMLFormElement, FormCommonProps>(
  (
    {
      children,
      isSubmitting = false,
      showValidationToast = true,
      onInvalidCapture,
      onSubmit,
      ...props
    },
    ref,
  ) => {
    const formId = useId();

    function handleInvalid(event: FormEvent<HTMLFormElement>) {
      onInvalidCapture?.(event);
      if (!showValidationToast || event.defaultPrevented) return;
      event.preventDefault();
      const input = event.target as
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      const firstInvalid = Array.from(event.currentTarget.elements).find(
        (control) =>
          "validity" in control &&
          (control as HTMLInputElement).willValidate &&
          !(control as HTMLInputElement).validity.valid,
      );
      if (firstInvalid !== input) return;
      const label = input.labels?.[0]?.textContent?.trim();
      const message = input.validity.valueMissing
        ? label
          ? VALIDATION_MESSAGES.REQUIRED(label)
          : VALIDATION_MESSAGES.REQUIRED_FIELD
        : input instanceof HTMLInputElement &&
            input.type === "email" &&
            input.validity.typeMismatch
          ? VALIDATION_MESSAGES.EMAIL_INVALID
          : VALIDATION_MESSAGES.INVALID_FORMAT;
      input.focus();
      notify.error(message, { id: `form-validation-${formId}` });
    }

    return (
      <form
        {...props}
        ref={ref}
        aria-busy={isSubmitting || undefined}
        onInvalidCapture={handleInvalid}
        onSubmit={(event) => {
          if (isSubmitting) event.preventDefault();
          else onSubmit?.(event);
        }}
      >
        {children}
      </form>
    );
  },
);
FormCommon.displayName = "FormCommon";
