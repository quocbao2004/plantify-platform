import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Leaf,
  Sprout,
  MessageCircle,
  Users,
  Settings,
  HelpCircle,
  Bell,
  Home,
} from "lucide-react";
import { LABELS } from "@/constants/labels";
import { LinkCommon } from "@/components/common/LinkCommon";
import { ButtonCommon } from "@/components/common/ButtonCommon";
import { TextFieldCommon } from "@/components/common/TextFieldCommon";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { useAuthStore } from "@/stores/authStore";

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: number;
  to: string;
}> = ({ icon, label, active, badge, to }) => (
  <LinkCommon
    to={to}
    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      active
        ? "bg-brand text-white shadow-xs"
        : "text-surface-600 hover:bg-surface-100 hover:text-surface-900"
    }`}
  >
    <span className="w-4 h-4 shrink-0">{icon}</span>
    <span className="flex-1">{label}</span>
    {badge ? (
      <span className="ml-auto bg-orange-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
        {badge}
      </span>
    ) : null}
  </LinkCommon>
);

const AdminSidebar: React.FC = () => {
  const { pathname } = useLocation();

  const isOverview = pathname === "/admin" || pathname === "/admin/";
  const isCustomers = pathname.startsWith("/admin/customers");
  const isOrders = pathname.startsWith("/admin/orders");
  const isPlants = pathname.startsWith("/admin/plants");
  const isConsults = pathname.startsWith("/admin/consults");
  const isSettings = pathname.startsWith("/admin/settings");

  return (
    <aside className="w-56 shrink-0 flex flex-col bg-white border-r border-surface-200 min-h-screen sticky top-0">
      {/* Brand Header — lấy icon Sprout giống logo trang chủ */}
      <div className="px-5 py-4 border-b border-surface-100 flex items-center">
        <LinkCommon
          to="/"
          className="inline-flex items-center gap-2 text-surface-900 hover:opacity-85 transition-opacity"
          aria-label={LABELS.navigation.BRAND_HOME}
          title={LABELS.navigation.BRAND_HOME}
        >
          <Sprout className="w-6 h-6 text-brand stroke-[1.5]" aria-hidden="true" />
          <span className="font-serif text-lg font-bold tracking-tight text-surface-900">
            {LABELS.common.BRAND}
          </span>
          <span className="text-[9px] text-brand -ml-1 -mt-2 font-semibold" aria-hidden="true">
            {LABELS.common.REGISTERED}
          </span>
        </LinkCommon>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-[10px] font-semibold text-surface-400 uppercase tracking-widest px-3 mb-2">
          {LABELS.admin.SIDEBAR_SECTION}
        </p>
        <NavItem
          icon={<LayoutDashboard />}
          label={LABELS.admin.SIDEBAR_OVERVIEW}
          active={isOverview}
          to="/admin"
        />
        <NavItem
          icon={<ShoppingBag />}
          label={LABELS.admin.SIDEBAR_ORDERS}
          active={isOrders}
          to="/admin/orders"
        />
        <NavItem
          icon={<Leaf />}
          label={LABELS.admin.SIDEBAR_PLANTS}
          active={isPlants}
          to="/admin/plants"
        />
        <NavItem
          icon={<MessageCircle />}
          label={LABELS.admin.SIDEBAR_CONSULT}
          active={isConsults}
          to="/admin/consults"
        />
        <NavItem
          icon={<Users />}
          label={LABELS.admin.SIDEBAR_CUSTOMERS}
          active={isCustomers}
          to="/admin/customers"
        />
        <NavItem
          icon={<Settings />}
          label={LABELS.admin.SIDEBAR_SETTINGS}
          active={isSettings}
          to="/admin/settings"
        />
      </nav>

      {/* Promo banner */}
      <div className="mx-3 mb-3 rounded-xl bg-brand/5 p-3 border border-brand/10">
        <div className="w-full h-16 rounded-lg bg-brand/10 mb-2 flex items-center justify-center">
          <Leaf className="w-7 h-7 text-brand/40" />
        </div>
        <p className="text-xs font-semibold text-brand leading-snug">
          {LABELS.admin.SIDEBAR_PROMO_TITLE}
        </p>
        <p className="text-[11px] text-surface-500 mt-0.5 leading-snug">
          {LABELS.admin.SIDEBAR_PROMO_DESC}
        </p>
      </div>

      {/* Help link */}
      <div className="px-3 py-3 border-t border-surface-100">
        <NavItem
          icon={<HelpCircle />}
          label={LABELS.admin.SIDEBAR_HELP}
          to="/help"
        />
      </div>
    </aside>
  );
};

const AdminHeader: React.FC = () => {
  const user = useAuthStore((s) => s.user);

  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .filter(Boolean)
        .slice(-2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "AD";

  return (
    <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-xs border-b border-surface-200/80 px-6 lg:px-8 py-3 flex items-center gap-4 shadow-2xs">
      {/* Global quick search using TextFieldCommon */}
      <div className="flex-1 max-w-sm">
        <TextFieldCommon
          type="search"
          label={LABELS.admin.HEADER_SEARCH_PLACEHOLDER}
          hideLabel
          placeholder={LABELS.admin.HEADER_SEARCH_PLACEHOLDER}
          className="text-xs h-9 bg-surface-50/80 border-surface-200 rounded-lg focus:bg-white"
          rightElement={
            <kbd className="hidden sm:inline-flex text-[10px] text-surface-400 bg-surface-100 px-1.5 py-0.5 rounded border border-surface-200">
              {LABELS.admin.SEARCH_SHORTCUT}
            </kbd>
          }
        />
      </div>

      {/* Right controls */}
      <div className="ml-auto flex items-center gap-3">
        <span className="hidden sm:block text-xs text-surface-500 font-medium">
          {LABELS.admin.LANGUAGES}
        </span>

        {/* Notifications Button using ButtonCommon */}
        <ButtonCommon
          variant="ghost"
          size="unstyled"
          aria-label={LABELS.admin.HEADER_NOTIFICATION}
          className="relative w-8 h-8 rounded-lg hover:bg-surface-100 flex items-center justify-center transition-colors p-0"
        >
          <Bell className="w-4 h-4 text-surface-600" />
          <span
            className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white"
            aria-hidden="true"
          />
        </ButtonCommon>

        {/* User badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center shadow-2xs ring-1 ring-brand/20">
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-surface-800 leading-tight">
              {user?.full_name || user?.email || LABELS.admin.HEADER_ADMIN_ROLE}
            </p>
            <p className="text-[10px] text-surface-400">
              {LABELS.admin.HEADER_ADMIN_ROLE}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-surface-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />

        <main className="flex-1 p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>

        {/* Footer — Có nút quay về trang chủ góc phải dưới cùng */}
        <footer className="px-6 lg:px-8 py-3 border-t border-surface-200/80 flex items-center justify-between text-[11px] text-surface-400 bg-white">
          <span>
            {LABELS.common.BRAND} · {LABELS.footer.MADE_IN}
          </span>
          <LinkCommon
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-200 text-xs font-medium text-surface-700 hover:bg-surface-100 hover:text-surface-900 transition-colors shadow-2xs"
          >
            <Home className="w-3.5 h-3.5" />
            {LABELS.navigation.HOME}
          </LinkCommon>
        </footer>
      </div>
    </div>
  );
};
