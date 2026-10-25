import { toast, type ExternalToast } from "sonner";

/** One notification entry point, independent of the UI library used by callers. */
export const notify = {
  success: (message: string, options?: ExternalToast) =>
    toast.success(message, options),
  error: (message: string, options?: ExternalToast) =>
    toast.error(message, { id: message, ...options }),
  info: (message: string, options?: ExternalToast) =>
    toast.info(message, options),
  dismiss: (id?: string | number) => toast.dismiss(id),
};
