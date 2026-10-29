import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ErrorBoundary } from "@/components/common";

export const MainLayout: React.FC = () => {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const isAuth = pathname === "/login";

  if (isAuth) {
    return (
      <div className="store-shell min-h-screen">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </div>
    );
  }

  return (
    <div className="store-shell min-h-screen flex flex-col">
      <Header />
      <main
        id="main-content"
        className={
          isHome
            ? "flex-1 w-full"
            : "flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8"
        }
      >
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};
