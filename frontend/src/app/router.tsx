import { createBrowserRouter, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout";
import { AuthGuard, GuestGuard, AdminGuard } from "./guards";

// Feature Pages
import { HomePage } from "@/features/catalog/pages/HomePage";
import { ProductListPage, ProductDetailPage } from "@/features/catalog";
import { LoginPage, RegisterPage, ProfilePage } from "@/features/auth";
import { CartPage } from "@/features/cart";
import { CheckoutPage } from "@/features/checkout";
import { OrderListPage } from "@/features/orders";
import { RentalListPage } from "@/features/rentals";
import { AdminDashboardPage } from "@/features/admin";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      // Public Routes
      { index: true, element: <HomePage /> },
      { path: "catalog", element: <ProductListPage /> },
      { path: "catalog/:idOrSlug", element: <ProductDetailPage /> },
      { path: "rentals", element: <RentalListPage /> },

      // Guest Only Routes (Login, Register)
      {
        element: <GuestGuard />,
        children: [
          { path: "login", element: <LoginPage /> },
          { path: "register", element: <RegisterPage /> },
        ],
      },

      // Authenticated User Routes
      {
        element: <AuthGuard />,
        children: [
          { path: "cart", element: <CartPage /> },
          { path: "checkout", element: <CheckoutPage /> },
          { path: "orders", element: <OrderListPage /> },
          { path: "profile", element: <ProfilePage /> },
        ],
      },

      // Admin Only Routes
      {
        path: "admin",
        element: <AdminGuard />,
        children: [{ index: true, element: <AdminDashboardPage /> }],
      },

      // Fallback 404
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
