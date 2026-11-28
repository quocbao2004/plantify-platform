import { useLocation } from "react-router-dom";

export function authReturnLink(path: "/login" | "/register", destination: string) {
  return destination === "/" ? path : path + "?" + new URLSearchParams({ next: destination });
}

export function useAuthDestination() {
  const { search } = useLocation();
  const next = new URLSearchParams(search).get("next");
  if (next === "/checkout" || next === "/orders" || next?.startsWith("/orders?")) return next;
  return "/";
}
