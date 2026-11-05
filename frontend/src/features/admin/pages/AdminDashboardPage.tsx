import React, { useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Leaf,
  MessageCircle,
  Users,
  Settings,
  HelpCircle,
  Bell,
  Search,
  CalendarDays,
  Download,
  Filter,
  ChevronRight,
  Phone,
  MessageSquare,
  Home,
  TrendingUp,
} from "lucide-react";
import { LABELS } from "@/constants/labels";
import { ButtonCommon } from "@/components/common/ButtonCommon";
import { LinkCommon } from "@/components/common/LinkCommon";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import {
  type OrderStatus,
  type ConsultStatus,
  type OrderRow,
  type ConsultRow,
} from "../constants/dashboardData";
import { useAuthStore } from "@/stores/authStore";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatVND = (amount: number) => amount.toLocaleString("vi-VN") + " đ";

const ORDER_STATUS_MAP: Record<OrderStatus, { label: string; className: string }> = {
  pending:    { label: LABELS.admin.STATUS_PENDING,    className: "bg-orange-100 text-orange-600" },
  delivering: { label: LABELS.admin.STATUS_DELIVERING, className: "bg-blue-100 text-blue-600" },
  done:       { label: LABELS.admin.STATUS_DONE,       className: "bg-green-100 text-green-700" },
  cancelled:  { label: LABELS.admin.STATUS_CANCELLED,  className: "bg-red-100 text-red-600" },
};

const CONSULT_STATUS_MAP: Record<ConsultStatus, { label: string; className: string }> = {
  not_called: { label: LABELS.admin.STATUS_NOT_CALLED, className: "text-orange-500" },
  supported:  { label: LABELS.admin.STATUS_SUPPORTED,  className: "text-green-600" },
};

// ─── Empty State ─────────────────────────────────────────────────────────────

const EmptyRow: React.FC<{ colSpan: number; message: string }> = ({ colSpan, message }) => (
  <tr>
    <td colSpan={colSpan} className="py-10 text-center text-sm text-surface-400 italic">
      {message}
    </td>
  </tr>
);

const EmptyList: React.FC<{ message: string }> = ({ message }) => (
  <div className="py-10 text-center text-sm text-surface-400 italic">{message}</div>
);

// ─── Sub-components ───────────────────────────────────────────────────────────

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: number;
  to?: string;
}> = ({ icon, label, active, badge, to = "#" }) => (
  <LinkCommon
    to={to}
    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      active
        ? "bg-brand text-white"
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

const StatCard: React.FC<{
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ label, icon, children }) => (
  <Card className="p-5">
    <div className="flex items-start justify-between mb-3">
      <p className="text-xs text-surface-500 font-medium">{label}</p>
      <span className="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center shrink-0">
        {icon}
      </span>
    </div>
    {children}
  </Card>
);

const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const { label, className } = ORDER_STATUS_MAP[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${className}`}>
      • {label}
    </span>
  );
};

const OrderTableRow: React.FC<{ row: OrderRow }> = ({ row }) => (
  <tr className="border-t border-surface-100 hover:bg-surface-50 transition-colors">
    <td className="py-3 px-4 text-sm font-medium text-brand">{row.id}</td>
    <td className="py-3 px-4 text-sm text-surface-800">{row.customerName}</td>
    <td className="py-3 px-4">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded bg-surface-100 shrink-0 flex items-center justify-center">
          <Leaf className="w-4 h-4 text-brand/60" />
        </div>
        <span className="text-sm text-surface-700 leading-tight">{row.productName}</span>
      </div>
    </td>
    <td className="py-3 px-4 text-xs text-surface-500 max-w-[160px] truncate">{row.specialNote}</td>
    <td className="py-3 px-4">
      <StatusBadge status={row.status} />
    </td>
    <td className="py-3 px-4 text-sm text-surface-700 text-right">
      {row.total != null ? formatVND(row.total) : "—"}
    </td>
  </tr>
);

const ConsultCard: React.FC<{ row: ConsultRow }> = ({ row }) => {
  const { label, className } = CONSULT_STATUS_MAP[row.status];
  return (
    <div className="p-4 border-b border-surface-100 last:border-0">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-brand/10 text-brand text-xs font-bold flex items-center justify-center shrink-0">
          {row.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-surface-800">{row.customerName}</p>
            <span className={`text-[11px] font-semibold ${className}`}>• {label}</span>
          </div>
          <p className="text-[11px] text-surface-400">{row.phone}</p>
          <div className="flex items-center gap-1 mt-1">
            <MessageSquare className="w-3 h-3 text-surface-400" />
            <p className="text-xs text-surface-500 italic truncate">{row.note}</p>
          </div>
          <p className="text-[11px] text-surface-400 mt-0.5">{row.topic}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-3 pl-12">
        {row.status === "not_called" ? (
          <button className="flex items-center gap-1.5 text-xs text-brand font-medium hover:underline">
            <Phone className="w-3 h-3" />
            {LABELS.admin.CONSULT_CALL}
          </button>
        ) : (
          <button className="flex items-center gap-1.5 text-xs text-surface-500 font-medium hover:underline">
            <ChevronRight className="w-3 h-3" />
            {LABELS.admin.CONSULT_DETAIL}
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const AdminSidebar: React.FC = () => (
  <aside className="w-56 shrink-0 flex flex-col bg-white border-r border-surface-200 min-h-screen sticky top-0">
    <div className="px-5 py-4 border-b border-surface-100 flex items-center gap-2">
      <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center">
        <Leaf className="w-4 h-4 text-white" />
      </div>
      <span className="text-sm font-bold text-surface-900">{LABELS.common.BRAND}</span>
    </div>

    <nav className="flex-1 px-3 py-4 space-y-1">
      <p className="text-[10px] font-semibold text-surface-400 uppercase tracking-widest px-3 mb-2">
        {LABELS.admin.SIDEBAR_SECTION}
      </p>
      <NavItem icon={<LayoutDashboard />} label={LABELS.admin.SIDEBAR_OVERVIEW}  active to="/admin" />
      <NavItem icon={<ShoppingBag />}     label={LABELS.admin.SIDEBAR_ORDERS}    to="/admin/orders" />
      <NavItem icon={<Leaf />}            label={LABELS.admin.SIDEBAR_PLANTS}    to="/admin/plants" />
      <NavItem icon={<MessageCircle />}   label={LABELS.admin.SIDEBAR_CONSULT}   to="/admin/consults" />
      <NavItem icon={<Users />}           label={LABELS.admin.SIDEBAR_CUSTOMERS} to="/admin/customers" />
      <NavItem icon={<Settings />}        label={LABELS.admin.SIDEBAR_SETTINGS}  to="/admin/settings" />
    </nav>

    <div className="mx-3 mb-3 rounded-xl bg-brand/5 p-3">
      <div className="w-full h-16 rounded-lg bg-brand/10 mb-2 flex items-center justify-center">
        <Leaf className="w-7 h-7 text-brand/40" />
      </div>
      <p className="text-xs font-semibold text-brand leading-snug">{LABELS.admin.SIDEBAR_PROMO_TITLE}</p>
      <p className="text-[11px] text-surface-500 mt-0.5 leading-snug">{LABELS.admin.SIDEBAR_PROMO_DESC}</p>
    </div>

    <div className="px-3 py-3 border-t border-surface-100">
      <NavItem icon={<HelpCircle />} label={LABELS.admin.SIDEBAR_HELP} to="/help" />
    </div>
  </aside>
);

// ─── Top Header ───────────────────────────────────────────────────────────────

const AdminHeader: React.FC = () => {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-surface-100 px-6 py-3 flex items-center gap-4">
      <div className="flex-1 max-w-sm relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
        <input
          type="search"
          placeholder={LABELS.admin.HEADER_SEARCH_PLACEHOLDER}
          className="w-full pl-9 pr-4 py-2 text-sm bg-surface-50 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/50 placeholder:text-surface-400"
        />
        <kbd className="hidden sm:inline-flex absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-surface-400 bg-surface-100 px-1.5 py-0.5 rounded">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <span className="hidden sm:block text-xs text-surface-500 font-medium">VN | EN</span>

        <button
          aria-label={LABELS.admin.HEADER_NOTIFICATION}
          className="relative w-8 h-8 rounded-lg hover:bg-surface-100 flex items-center justify-center transition-colors"
        >
          <Bell className="w-4 h-4 text-surface-600" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-500" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center">
            {user?.full_name
              ? user.full_name.split(" ").slice(-2).map((w) => w[0]).join("").toUpperCase()
              : "AD"}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-surface-800 leading-tight">
              {user?.full_name || user?.email || "Admin"}
            </p>
            <p className="text-[10px] text-surface-400">{LABELS.admin.HEADER_ADMIN_ROLE}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

// ─── Main Dashboard Page ──────────────────────────────────────────────────────

type TabKey = "all" | "orders" | "requests";

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const user = useAuthStore((s) => s.user);

  // Dữ liệu thực — hiện tại chưa có API nên để mảng rỗng
  const orders: OrderRow[]  = [];
  const consults: ConsultRow[] = [];

  const tabs: { key: TabKey; label: string }[] = [
    { key: "all",      label: LABELS.admin.ORDERS_TAB_ALL },
    { key: "orders",   label: LABELS.admin.ORDERS_TAB_ORDERS },
    { key: "requests", label: LABELS.admin.ORDERS_TAB_REQUESTS },
  ];

  return (
    <div className="flex min-h-screen bg-surface-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />

        <main className="flex-1 p-6 space-y-6">
          {/* Page Title */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-surface-900">
                {LABELS.admin.DASHBOARD_TITLE}
              </h1>
              <p className="text-xs text-surface-500 mt-0.5">
                {LABELS.admin.DASHBOARD_GREETING(user?.full_name || "Admin")}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <ButtonCommon variant="outline" size="sm" className="gap-1.5">
                <CalendarDays className="w-3.5 h-3.5" />
                {LABELS.admin.PERIOD_THIS_MONTH}
              </ButtonCommon>
              <ButtonCommon variant="outline" size="sm" className="gap-1.5">
                <Download className="w-3.5 h-3.5" />
                {LABELS.admin.EXPORT_REPORT}
              </ButtonCommon>
            </div>
          </div>

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard label={LABELS.admin.STAT_REVENUE} icon={<CalendarDays className="w-4 h-4" />}>
              <p className="text-2xl font-bold text-surface-300 tracking-tight">—</p>
              <p className="text-xs text-surface-400 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                {LABELS.common.LOADING_DATA}
              </p>
            </StatCard>

            <StatCard label={LABELS.admin.STAT_ORDERS} icon={<ShoppingBag className="w-4 h-4" />}>
              <p className="text-2xl font-bold text-surface-300 tracking-tight">—</p>
              <p className="text-xs text-surface-400 mt-1">{LABELS.common.LOADING_DATA}</p>
            </StatCard>

            <StatCard label={LABELS.admin.STAT_INVENTORY} icon={<Leaf className="w-4 h-4" />}>
              <p className="text-2xl font-bold text-surface-300 tracking-tight">—</p>
              <div className="mt-2 w-full h-1.5 rounded-full bg-surface-100" />
              <p className="text-xs text-surface-400 mt-1.5">{LABELS.common.LOADING_DATA}</p>
            </StatCard>

            <StatCard label={LABELS.admin.STAT_CONSULT} icon={<MessageCircle className="w-4 h-4" />}>
              <p className="text-2xl font-bold text-surface-300 tracking-tight">—</p>
              <p className="text-xs text-surface-400 mt-1">{LABELS.common.LOADING_DATA}</p>
            </StatCard>
          </div>

          {/* ── Bottom Two-Column ── */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Orders Table */}
            <Card className="xl:col-span-2 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm">{LABELS.admin.ORDERS_SECTION_TITLE}</CardTitle>
                  <p className="text-[11px] text-surface-400 mt-0.5">{LABELS.admin.ORDERS_SECTION_DESC}</p>
                </div>
                <LinkCommon
                  to="/admin/orders"
                  className="text-xs text-brand font-medium hover:underline flex items-center gap-1"
                >
                  {LABELS.admin.ORDERS_VIEW_ALL}
                  <ChevronRight className="w-3.5 h-3.5" />
                </LinkCommon>
              </CardHeader>

              <CardContent className="p-0">
                <div className="flex items-center justify-between px-4 py-2 border-b border-surface-100">
                  <div className="flex items-center gap-1">
                    {tabs.map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                          activeTab === tab.key
                            ? "bg-surface-900 text-white"
                            : "text-surface-500 hover:bg-surface-100"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  <ButtonCommon variant="ghost" size="sm" className="gap-1.5 text-surface-500">
                    <Filter className="w-3.5 h-3.5" />
                    {LABELS.admin.ORDERS_FILTER}
                  </ButtonCommon>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-surface-50">
                        {[
                          LABELS.admin.ORDERS_COL_ID,
                          LABELS.admin.ORDERS_COL_CUSTOMER,
                          LABELS.admin.ORDERS_COL_PRODUCT,
                          LABELS.admin.ORDERS_COL_NOTE,
                          LABELS.admin.ORDERS_COL_STATUS,
                          LABELS.admin.ORDERS_COL_TOTAL,
                        ].map((col) => (
                          <th
                            key={col}
                            className="py-2 px-4 text-[11px] font-semibold text-surface-500 uppercase tracking-wide"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length > 0
                        ? orders.map((row) => <OrderTableRow key={row.id} row={row} />)
                        : <EmptyRow colSpan={6} message={LABELS.common.LOADING_DATA} />
                      }
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Consult Panel */}
            <Card className="overflow-hidden flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm">{LABELS.admin.CONSULT_TITLE}</CardTitle>
                  <p className="text-[11px] text-surface-400 mt-0.5">{LABELS.admin.CONSULT_DESC}</p>
                </div>
                <MessageCircle className="w-4 h-4 text-surface-400 shrink-0" />
              </CardHeader>

              <CardContent className="p-0 flex-1">
                {consults.length > 0
                  ? consults.map((row) => <ConsultCard key={row.id} row={row} />)
                  : <EmptyList message={LABELS.common.LOADING_DATA} />
                }
              </CardContent>

              <div className="p-4 border-t border-surface-100">
                <LinkCommon
                  to="/admin/consults"
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-surface-200 text-xs font-medium text-surface-700 hover:bg-surface-50 transition-colors"
                >
                  {LABELS.admin.CONSULT_VIEW_ALL}
                  <ChevronRight className="w-3.5 h-3.5" />
                </LinkCommon>
              </div>
            </Card>
          </div>
        </main>

        {/* Footer — nút về trang chủ góc phải dưới */}
        <footer className="px-6 py-3 border-t border-surface-100 flex items-center justify-between text-[11px] text-surface-400">
          <span>{LABELS.common.BRAND} · {LABELS.footer.MADE_IN}</span>
          <LinkCommon
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-200 text-xs font-medium text-surface-600 hover:bg-surface-100 hover:text-surface-900 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            {LABELS.navigation.HOME}
          </LinkCommon>
        </footer>
      </div>
    </div>
  );
};
