import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import {
  FieldCommon,
  fieldControlClassName,
  fieldDescriptionId,
  type FieldCommonProps,
} from "./FieldCommon";

export interface TextFieldCommonProps
  extends
    InputHTMLAttributes<HTMLInputElement>,
    Omit<FieldCommonProps, "id" | "children"> {
  variant?: "default" | "unstyled";
}

export const TextFieldCommon = forwardRef<
  HTMLInputElement,
  TextFieldCommonProps
>(
  (
    {
      label,
      hideLabel,
      error,
      helperText,
      wrapperClassName,
      variant = "default",
      className,
      id,
      "aria-describedby": describedBy,
      "aria-invalid": invalid,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    return (
      <FieldCommon
        id={inputId}
        label={label}
        hideLabel={hideLabel}
        error={error}
        helperText={helperText}
        wrapperClassName={wrapperClassName}
      >
        <input
          {...props}
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : invalid}
          aria-describedby={fieldDescriptionId(
            inputId,
            error,
            helperText,
            describedBy,
          )}
          className={cn(
            variant === "default" && fieldControlClassName,
            variant === "default" &&
              (error
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-surface-300"),
            className,
          )}
        />
      </FieldCommon>
    );
  },
);
TextFieldCommon.displayName = "TextFieldCommon";
