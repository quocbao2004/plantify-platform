import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import {
  FieldCommon,
  fieldControlClassName,
  fieldDescriptionId,
  type FieldCommonProps,
} from "./FieldCommon";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}
export interface SelectCommonProps
  extends
    SelectHTMLAttributes<HTMLSelectElement>,
    Omit<FieldCommonProps, "id" | "children"> {
  options: readonly SelectOption[];
}

export const SelectCommon = forwardRef<HTMLSelectElement, SelectCommonProps>(
  (
    {
      options,
      label,
      hideLabel,
      error,
      helperText,
      wrapperClassName,
      className,
      id,
      "aria-describedby": describedBy,
      "aria-invalid": invalid,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    return (
      <FieldCommon
        id={selectId}
        label={label}
        hideLabel={hideLabel}
        error={error}
        helperText={helperText}
        wrapperClassName={wrapperClassName}
      >
        <select
          {...props}
          ref={ref}
          id={selectId}
          aria-invalid={error ? true : invalid}
          aria-describedby={fieldDescriptionId(
            selectId,
            error,
            helperText,
            describedBy,
          )}
          className={cn(
            fieldControlClassName,
            error ? "border-red-500" : "border-surface-300",
            className,
          )}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
      </FieldCommon>
    );
  },
);
SelectCommon.displayName = "SelectCommon";
