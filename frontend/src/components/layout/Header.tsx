import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Sprout, ShoppingCart, User as UserIcon, LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui";

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors hover:text-accent-700 ${
      isActive ? "text-accent-700 font-semibold" : "text-surface-600"
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-surface-200 bg-white/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 text-surface-900 hover:opacity-90">
            <div className="w-8 h-8 rounded bg-accent-600 text-white flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
            <span className="font-bold text-base tracking-tight text-surface-900">Plantify</span>
          </Link>

          {/* Main Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/catalog" className={navLinkClass}>
              Sản phẩm
            </NavLink>
            <NavLink to="/rentals" className={navLinkClass}>
              Dịch vụ thuê cây
            </NavLink>
            <NavLink to="/orders" className={navLinkClass}>
              Đơn hàng
            </NavLink>
            {user?.role === "ADMIN" && (
              <NavLink to="/admin" className={navLinkClass}>
                Quản trị
              </NavLink>
            )}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Link to="/cart" aria-label="Giỏ hàng">
            <Button variant="ghost" size="sm" className="relative p-2">
              <ShoppingCart className="w-4 h-4 text-surface-700" />
            </Button>
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link to="/profile">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <UserIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-xs">{user?.full_name || user?.email}</span>
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-surface-500 hover:text-red-600 p-2"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Đăng nhập
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Đăng ký
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
