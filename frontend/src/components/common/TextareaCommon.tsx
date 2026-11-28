import { forwardRef, useId, type TextareaHTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import {
  FieldCommon,
  fieldControlClassName,
  fieldDescriptionId,
  type FieldCommonProps,
} from "./FieldCommon";

export interface TextareaCommonProps
  extends
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    Omit<FieldCommonProps, "id" | "children"> {
  variant?: "default" | "unstyled" | "filled";
}

export const TextareaCommon = forwardRef<
  HTMLTextAreaElement,
  TextareaCommonProps
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
        <textarea
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
            variant === "filled" &&
              "w-full px-4 py-3 text-sm rounded bg-[#eff3ec] text-surface-900 border border-transparent transition-colors placeholder:text-surface-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#285a45] focus:border-[#285a45] disabled:bg-surface-100 disabled:text-surface-500 disabled:cursor-not-allowed",
            variant !== "unstyled" &&
              (error
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : variant === "filled"
                  ? "border-transparent"
                  : "border-surface-300"),
            "min-h-[84px] resize-y",
            className,
          )}
        />
      </FieldCommon>
    );
  },
);

TextareaCommon.displayName = "TextareaCommon";
