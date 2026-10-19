import React from "react";
import { RouterProvider } from "react-router-dom";
import { QueryProvider } from "./QueryProvider";
import { router } from "../router";

export const AppProviders: React.FC = () => {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  );
};
