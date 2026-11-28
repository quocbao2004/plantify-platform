import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useAuthDestination } from "@/features/auth/utils/checkoutRedirect";

export const GuestGuard: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const destination = useAuthDestination();

  if (isAuthenticated) {
    return <Navigate to={destination} replace />;
  }

  return <Outlet />;
};
