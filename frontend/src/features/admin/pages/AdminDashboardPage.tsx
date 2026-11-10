import React, { useState, useMemo } from "react";
import {
  ShoppingBag,
  Leaf,
  MessageCircle,
  CalendarDays,
  Download,
  Filter,
  ChevronRight,
  TrendingUp,
  MessageSquare,
  Phone,
  RefreshCw,
} from "lucide-react";
import { LABELS } from "@/constants/labels";
import { ButtonCommon } from "@/components/common/ButtonCommon";
import { LinkCommon } from "@/components/common/LinkCommon";
import { LoadingOverlay } from "@/components/common/LoadingOverlay";
import { TableCommon, type TableColumn } from "@/components/common/TableCommon";
import { EmptyState } from "@/components/common/EmptyState";
import { formatCurrencyVND } from "@/utils";
import { useAuthStore } from "@/stores/authStore";
import { useAdminDashboard } from "../hooks/useAdminDashboard";
import {
  DashboardRecentOrder,
  DashboardRecentConsult,
} from "../api/adminDashboardApi";

// ─── Constants & Status Mappings ─────────────────────────────────────────────

const ORDER_STATUS_MAP: Record<
  string,
  { label: string; className: string; dotColor: string }
> = {
  pending: {
    label: LABELS.admin.STATUS_PENDING,
    className: "bg-amber-50 text-amber-700 border-amber-200/70",
    dotColor: "bg-amber-500",
  },
  pending_payment: {
    label: LABELS.admin.STATUS_PENDING,
    className: "bg-amber-50 text-amber-700 border-amber-200/70",
    dotColor: "bg-amber-500",
  },
  paid: {
    label: LABELS.admin.STATUS_DONE,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200/70",
    dotColor: "bg-emerald-500",
  },
  delivering: {
    label: LABELS.admin.STATUS_DELIVERING,
    className: "bg-blue-50 text-blue-700 border-blue-200/70",
    dotColor: "bg-blue-500",
  },
  done: {
    label: LABELS.admin.STATUS_DONE,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200/70",
    dotColor: "bg-emerald-500",
  },
  completed: {
    label: LABELS.admin.STATUS_DONE,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200/70",
    dotColor: "bg-emerald-500",
  },
  cancelled: {
    label: LABELS.admin.STATUS_CANCELLED,
    className: "bg-rose-50 text-rose-700 border-rose-200/70",
    dotColor: "bg-rose-500",
  },
};

const CONSULT_STATUS_MAP: Record<
  string,
  { label: string; className: string }
> = {
  not_called: {
    label: LABELS.admin.STATUS_NOT_CALLED,
    className: "text-amber-600",
  },
  supported: {
    label: LABELS.admin.STATUS_SUPPORTED,
    className: "text-emerald-600",
  },
};

const DASHBOARD_TABS = [
  { key: "all", label: LABELS.admin.ORDERS_TAB_ALL },
  { key: "orders", label: LABELS.admin.ORDERS_TAB_ORDERS },
  { key: "requests", label: LABELS.admin.ORDERS_TAB_REQUESTS },
] as const;

type TabKey = (typeof DASHBOARD_TABS)[number]["key"];

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatCard: React.FC<{
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ label, icon, children }) => (
  <div className="bg-white rounded-2xl border border-surface-200/80 p-5 shadow-xs hover:shadow-sm hover:border-surface-300 transition-all duration-200 flex flex-col justify-between">
    <div className="flex items-center justify-between mb-3">
      <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
        {label}
      </p>
      <span className="w-9 h-9 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0 shadow-2xs">
        {icon}
      </span>
    </div>
    <div className="flex-1 flex flex-col justify-end">{children}</div>
  </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const normalized = status.toLowerCase();
  const config = ORDER_STATUS_MAP[normalized] || {
    label: status,
    className: "bg-surface-100 text-surface-700 border-surface-200/80",
    dotColor: "bg-surface-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border shadow-2xs ${config.className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      <span>{config.label}</span>
    </span>
  );
};

const ConsultCard: React.FC<{ row: DashboardRecentConsult }> = ({ row }) => {
  const config =
    CONSULT_STATUS_MAP[row.status] || CONSULT_STATUS_MAP.not_called;

  return (
    <div className="p-4 sm:p-5 border-b border-surface-100/80 last:border-0 hover:bg-surface-50/50 transition-colors">
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-full bg-brand/10 text-brand text-xs font-bold flex items-center justify-center shrink-0 ring-2 ring-brand/10">
          {row.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-surface-900 truncate">
              {row.customer_name}
            </p>
            <span
              className={`text-[11px] font-semibold shrink-0 inline-flex items-center gap-1 ${config.className}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {config.label}
            </span>
          </div>
          <p className="text-xs text-surface-400 mt-0.5">{row.phone}</p>
          <div className="flex items-start gap-1.5 mt-2 bg-surface-50/80 rounded-lg p-2 border border-surface-100">
            <MessageSquare className="w-3.5 h-3.5 text-surface-400 shrink-0 mt-0.5" />
            <p className="text-xs text-surface-600 italic line-clamp-2 leading-relaxed">
              {row.note}
            </p>
          </div>
          <p className="text-[11px] text-surface-400 mt-1.5 pl-1">{row.topic}</p>
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 mt-3 pt-2 border-t border-surface-100/60">
        {row.status === "not_called" ? (
          <ButtonCommon
            variant="ghost"
            size="sm"
            className="text-xs text-brand font-semibold hover:text-brand-dark p-0 h-auto gap-1.5"
          >
            <Phone className="w-3.5 h-3.5" />
            {LABELS.admin.CONSULT_CALL}
          </ButtonCommon>
        ) : (
          <ButtonCommon
            variant="ghost"
            size="sm"
            className="text-xs text-surface-500 font-medium hover:text-surface-800 p-0 h-auto gap-1"
          >
            <ChevronRight className="w-3.5 h-3.5" />
            {LABELS.admin.CONSULT_DETAIL}
          </ButtonCommon>
        )}
      </div>
    </div>
  );
};

// ─── Main Dashboard Page ──────────────────────────────────────────────────────

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const user = useAuthStore((s) => s.user);

  // Fetch real aggregated data from Backend API
  const { data, isLoading, isFetching, refetch } = useAdminDashboard();

  const stats = data?.stats;
  const recentOrders = data?.recent_orders ?? [];
  const recentConsults = data?.recent_consults ?? [];

  const orderColumns: TableColumn<DashboardRecentOrder>[] = useMemo(
    () => [
      {
        key: "id",
        header: LABELS.admin.ORDERS_COL_ID,
        render: (row) => (
          <span className="font-mono text-xs font-semibold text-brand tracking-wide bg-brand/5 px-2 py-0.5 rounded border border-brand/15">
            {row.id}
          </span>
        ),
      },
      {
        key: "customer_name",
        header: LABELS.admin.ORDERS_COL_CUSTOMER,
        render: (row) => (
          <span className="text-xs font-semibold text-surface-900 block truncate max-w-[140px]">
            {row.customer_name}
          </span>
        ),
      },
      {
        key: "product_name",
        header: LABELS.admin.ORDERS_COL_PRODUCT,
        render: (row) => (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50/80 text-brand shrink-0 flex items-center justify-center border border-emerald-100/80 shadow-2xs">
              <Leaf className="w-4 h-4" />
            </div>
            <span className="text-xs text-surface-700 font-medium leading-tight line-clamp-1">
              {row.product_name}
            </span>
          </div>
        ),
      },
      {
        key: "special_note",
        header: LABELS.admin.ORDERS_COL_NOTE,
        render: (row) => (
          <span className="text-xs text-surface-500 max-w-[160px] truncate block italic">
            {row.special_note || LABELS.admin.NO_NOTE}
          </span>
        ),
      },
      {
        key: "status",
        header: LABELS.admin.ORDERS_COL_STATUS,
        render: (row) => <StatusBadge status={row.status} />,
      },
      {
        key: "total",
        header: LABELS.admin.ORDERS_COL_TOTAL,
        align: "right",
        render: (row) => (
          <span className="text-xs font-bold text-surface-900 tracking-tight">
            {row.total != null
              ? formatCurrencyVND(row.total)
              : LABELS.admin.STATUS_UNAVAILABLE}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6 relative">
      {isLoading ? (
        <LoadingOverlay message={LABELS.common.LOADING_DATA} />
      ) : null}

      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight font-sans">
            {LABELS.admin.DASHBOARD_TITLE}
          </h1>
          <p className="text-xs sm:text-sm text-surface-500 mt-1">
            {LABELS.admin.DASHBOARD_GREETING(
              user?.full_name || LABELS.admin.HEADER_ADMIN_ROLE
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 flex-wrap">
          <ButtonCommon
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-1.5 h-9 px-3.5 text-xs font-medium rounded-lg border-surface-200 bg-white hover:bg-surface-50 shadow-2xs"
            aria-label={LABELS.common.RELOAD}
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">{LABELS.common.RELOAD}</span>
          </ButtonCommon>

          <ButtonCommon
            variant="outline"
            size="sm"
            className="gap-1.5 h-9 px-3.5 text-xs font-medium rounded-lg border-surface-200 bg-white hover:bg-surface-50 shadow-2xs"
          >
            <CalendarDays className="w-3.5 h-3.5 text-surface-500" />
            {LABELS.admin.PERIOD_THIS_MONTH}
          </ButtonCommon>

          <ButtonCommon
            variant="outline"
            size="sm"
            className="gap-1.5 h-9 px-3.5 text-xs font-medium rounded-lg border-surface-200 bg-white hover:bg-surface-50 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-surface-500" />
            {LABELS.admin.EXPORT_REPORT}
          </ButtonCommon>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
        {/* Doanh thu */}
        <StatCard
          label={LABELS.admin.STAT_REVENUE}
          icon={<CalendarDays className="w-4 h-4" />}
        >
          <p className="text-2xl lg:text-[26px] font-bold text-surface-900 tracking-tight leading-none mt-2">
            {stats
              ? formatCurrencyVND(stats.revenue)
              : LABELS.admin.STATUS_UNAVAILABLE}
          </p>
          <div className="text-xs font-medium text-emerald-600 flex items-center gap-1 mt-2.5">
            <TrendingUp className="w-3.5 h-3.5 shrink-0" />
            <span>
              {LABELS.admin.STAT_REVENUE_TREND(stats?.revenue_trend_pct ?? 0)}
            </span>
          </div>
        </StatCard>

        {/* Đơn hàng */}
        <StatCard
          label={LABELS.admin.STAT_ORDERS}
          icon={<ShoppingBag className="w-4 h-4" />}
        >
          <div className="flex items-baseline mt-2">
            <p className="text-2xl lg:text-[26px] font-bold text-surface-900 tracking-tight leading-none">
              {stats?.total_orders ?? 0}
            </p>
            <span className="text-sm font-normal text-surface-500 ml-1.5">
              {LABELS.admin.UNIT_ORDER}
            </span>
          </div>
          <p className="text-xs font-medium text-amber-600 mt-2.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
            {LABELS.admin.STAT_ORDERS_PENDING(stats?.pending_orders ?? 0)}
          </p>
        </StatCard>

        {/* Kho cây & sản phẩm */}
        <StatCard
          label={LABELS.admin.STAT_INVENTORY}
          icon={<Leaf className="w-4 h-4" />}
        >
          <div className="flex items-baseline mt-2">
            <p className="text-2xl lg:text-[26px] font-bold text-surface-900 tracking-tight leading-none">
              {stats?.total_inventory ?? 0}
            </p>
            <span className="text-sm font-normal text-surface-500 ml-1.5">
              {LABELS.admin.UNIT_PRODUCT}
            </span>
          </div>
          {stats && stats.total_inventory > 0 ? (
            <div className="mt-2.5">
              <div className="w-full h-2 rounded-full bg-surface-100 overflow-hidden flex gap-0.5">
                <div
                  style={{
                    width: `${
                      (stats.inventory_indoor / stats.total_inventory) * 100
                    }%`,
                  }}
                  className="bg-brand h-full rounded-l-full"
                />
                <div
                  style={{
                    width: `${
                      (stats.inventory_desktop / stats.total_inventory) * 100
                    }%`,
                  }}
                  className="bg-brand/50 h-full"
                />
                <div
                  style={{
                    width: `${
                      (stats.inventory_accessory / stats.total_inventory) * 100
                    }%`,
                  }}
                  className="bg-brand/20 h-full rounded-r-full"
                />
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] text-surface-500">
                {[
                  {
                    label: LABELS.admin.INVENTORY_INDOOR,
                    value: stats.inventory_indoor,
                    color: "bg-brand",
                  },
                  {
                    label: LABELS.admin.INVENTORY_DESKTOP,
                    value: stats.inventory_desktop,
                    color: "bg-brand/50",
                  },
                  {
                    label: LABELS.admin.INVENTORY_ACCESSORY,
                    value: stats.inventory_accessory,
                    color: "bg-brand/20",
                  },
                ].map((item) => (
                  <span
                    key={item.label}
                    className="inline-flex items-center gap-1.5"
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${item.color} shrink-0`}
                    />
                    <span>
                      {item.value} {item.label}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-surface-400 mt-2.5">
              {LABELS.common.LOADING_DATA}
            </p>
          )}
        </StatCard>

        {/* Yêu cầu tư vấn */}
        <StatCard
          label={LABELS.admin.STAT_CONSULT}
          icon={<MessageCircle className="w-4 h-4" />}
        >
          <div className="flex items-baseline mt-2">
            <p className="text-2xl lg:text-[26px] font-bold text-surface-900 tracking-tight leading-none">
              {stats?.new_consults ?? 0}
            </p>
            <span className="text-sm font-normal text-surface-500 ml-1.5">
              {LABELS.admin.UNIT_NEW_REQUESTS}
            </span>
          </div>
          <p className="text-xs font-medium text-amber-600 mt-2.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
            {LABELS.admin.STAT_CONSULT_CTA}
          </p>
        </StatCard>
      </div>

      {/* ── Bottom Two-Column ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Orders Table using TableCommon */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-surface-200/80 shadow-xs overflow-hidden">
          <div className="px-6 py-4.5 border-b border-surface-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-surface-900 tracking-tight">
                {LABELS.admin.ORDERS_SECTION_TITLE}
              </h2>
              <p className="text-xs text-surface-400 mt-0.5">
                {LABELS.admin.ORDERS_SECTION_DESC}
              </p>
            </div>
            <LinkCommon
              to="/admin/orders"
              className="text-xs font-semibold text-brand hover:text-brand-dark flex items-center gap-1 transition-colors"
            >
              {LABELS.admin.ORDERS_VIEW_ALL}
              <ChevronRight className="w-3.5 h-3.5" />
            </LinkCommon>
          </div>

          <div>
            {/* Filter Tabs using ButtonCommon */}
            <div className="flex items-center justify-between px-6 py-2.5 bg-surface-50/50 border-b border-surface-100 gap-3">
              <div className="flex items-center gap-1.5">
                {DASHBOARD_TABS.map((tab) => (
                  <ButtonCommon
                    key={tab.key}
                    variant={activeTab === tab.key ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab(tab.key)}
                    className={`h-8 px-3 text-xs font-medium rounded-lg transition-all ${
                      activeTab === tab.key
                        ? "bg-surface-900 text-white shadow-xs hover:bg-surface-800"
                        : "text-surface-600 hover:text-surface-900 hover:bg-surface-200/60"
                    }`}
                  >
                    {tab.label}
                  </ButtonCommon>
                ))}
              </div>
              <ButtonCommon
                variant="ghost"
                size="sm"
                className="gap-1.5 text-surface-500 hover:text-surface-800 text-xs h-8 px-2.5"
              >
                <Filter className="w-3.5 h-3.5" />
                {LABELS.admin.ORDERS_FILTER}
              </ButtonCommon>
            </div>

            {/* Table using generic TableCommon */}
            <TableCommon
              columns={orderColumns}
              data={recentOrders}
              rowKey="id"
              isLoading={isLoading}
              emptyTitle={LABELS.admin.EMPTY_ORDERS}
            />

            {/* Footer tip */}
            <div className="px-6 py-3.5 border-t border-surface-100 flex items-center gap-3 bg-emerald-50/30">
              <div className="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center shrink-0 shadow-2xs">
                <Leaf className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-surface-800">
                  {LABELS.admin.ORDERS_FOOTER_TIP}
                </p>
                <p className="text-[11px] text-surface-500 mt-0.5">
                  {LABELS.admin.ORDERS_FOOTER_SUB}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Consult Panel */}
        <div className="bg-white rounded-2xl border border-surface-200/80 shadow-xs overflow-hidden flex flex-col">
          <div className="px-6 py-4.5 border-b border-surface-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-surface-900 tracking-tight">
                {LABELS.admin.CONSULT_TITLE}
              </h2>
              <p className="text-xs text-surface-400 mt-0.5">
                {LABELS.admin.CONSULT_DESC}
              </p>
            </div>
            <span className="w-8 h-8 rounded-lg bg-surface-100 text-surface-500 flex items-center justify-center shrink-0">
              <MessageCircle className="w-4 h-4" />
            </span>
          </div>

          <div className="flex-1 divide-y divide-surface-100">
            {recentConsults.length > 0 ? (
              recentConsults.map((row) => (
                <ConsultCard key={row.id} row={row} />
              ))
            ) : (
              <div className="p-8">
                <EmptyState
                  title={LABELS.admin.EMPTY_CONSULTS}
                  className="border-none bg-transparent p-4"
                />
              </div>
            )}
          </div>

          <div className="p-4 border-t border-surface-100 bg-surface-50/30">
            <LinkCommon
              to="/admin/consults"
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-surface-200 text-xs font-semibold text-surface-700 hover:text-surface-900 hover:bg-white hover:border-surface-300 transition-all shadow-2xs"
            >
              {LABELS.admin.CONSULT_VIEW_ALL}
              <ChevronRight className="w-3.5 h-3.5" />
            </LinkCommon>
          </div>
        </div>
      </div>
    </div>
  );
};
