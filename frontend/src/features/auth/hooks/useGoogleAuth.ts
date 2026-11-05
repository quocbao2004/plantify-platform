import { useRef, useState } from "react";
import { env } from "@/config/env";
import { notify } from "@/services/notifications";
import { triggerGoogleLogin } from "@/services/socialAuth";
import { MESSAGES } from "@/constants/messages";
import { useSocialLogin } from "./useAuth";

export function useGoogleAuth() {
  const { mutateAsync: socialLogin } = useSocialLogin();
  const [isPending, setIsPending] = useState(false);
  const inFlight = useRef(false);

  const handleGoogleLogin = async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setIsPending(true);
    try {
      let token: string;
      try {
        token = await triggerGoogleLogin(env.VITE_GOOGLE_CLIENT_ID);
      } catch (error) {
        notify.error(error instanceof Error ? error.message : MESSAGES.GOOGLE_AUTH_ERROR);
        return;
      }
      await socialLogin({ provider: "GOOGLE", access_token: token });
    } catch {
      // API failures are reported once by the global mutation cache.
    } finally {
      inFlight.current = false;
      setIsPending(false);
    }
  };

  return { isPending, handleGoogleLogin };
}
