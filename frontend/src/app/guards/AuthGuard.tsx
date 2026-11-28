import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { authReturnLink } from "@/features/auth/utils/checkoutRedirect";

export const AuthGuard: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    const destination = ["/checkout", "/orders"].includes(location.pathname)
      ? location.pathname + location.search : "/";
    const loginPath = authReturnLink("/login", destination);
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  return <Outlet />;
};
