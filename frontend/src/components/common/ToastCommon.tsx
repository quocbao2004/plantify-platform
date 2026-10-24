import { Toaster } from "sonner";
import { LABELS } from "@/constants/labels";

export function ToastCommon() {
  return (
    <Toaster
      theme="light"
      position="top-right"
      richColors
      closeButton
      duration={4500}
      visibleToasts={4}
      offset={24}
      mobileOffset={16}
      containerAriaLabel={LABELS.common.NOTIFICATIONS}
      toastOptions={{
        className: "toast-common",
        closeButtonAriaLabel: LABELS.common.CLOSE,
      }}
    />
  );
}
