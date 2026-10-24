import React from "react";
import { RouterProvider } from "react-router-dom";
import { QueryProvider } from "./QueryProvider";
import { router } from "../router";
import { ToastCommon } from "@/components/common/ToastCommon";

export const AppProviders: React.FC = () => {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
      <ToastCommon />
    </QueryProvider>
  );
};
