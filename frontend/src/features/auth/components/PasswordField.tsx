import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { ButtonCommon } from "@/components/common/ButtonCommon";
import { TextFieldCommon, type TextFieldCommonProps } from "@/components/common/TextFieldCommon";
import { LABELS } from "@/constants/labels";

interface PasswordFieldProps extends Omit<TextFieldCommonProps, "type" | "rightElement"> {
  confirmation?: boolean;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ confirmation = false, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    const showLabel = confirmation ? LABELS.auth.SHOW_CONFIRM_PASSWORD : LABELS.auth.SHOW_PASSWORD;
    const hideLabel = confirmation ? LABELS.auth.HIDE_CONFIRM_PASSWORD : LABELS.auth.HIDE_PASSWORD;
    return (
      <TextFieldCommon
        {...props}
        ref={ref}
        type={visible ? "text" : "password"}
        rightElement={
          <ButtonCommon
            variant="ghost"
            size="unstyled"
            className="p-1 text-surface-400 hover:text-surface-600"
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? hideLabel : showLabel}
            aria-pressed={visible}
            disabled={props.disabled}
          >
            {visible ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
          </ButtonCommon>
        }
      />
    );
  },
);
PasswordField.displayName = "PasswordField";
