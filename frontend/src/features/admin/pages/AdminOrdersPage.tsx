import React, { useState, useMemo } from "react";
import {
  ShoppingBag,
  Clock,
  PackageCheck,
  Truck,
  CheckCircle2,
  XCircle,
  Eye,
  Pencil,
  RefreshCw,
  Search,
  Filter,
} from "lucide-react";
import { LABELS } from "@/constants/labels";
import { ButtonCommon } from "@/components/common/ButtonCommon";
import { TextFieldCommon } from "@/components/common/TextFieldCommon";
import { SelectCommon } from "@/components/common/SelectCommon";
import { TableCommon, type TableColumn } from "@/components/common/TableCommon";
import { BadgeCommon } from "@/components/common/BadgeCommon";
import { formatCurrencyVND } from "@/utils/formatCurrency";
import { useAdminOrders, useUpdateAdminOrderStatus } from "../hooks/useAdminOrders";
import { AdminOrder, AdminOrderStatus } from "../types";
import {
  ADMIN_ORDER_STATUS_CONFIG,
  ADMIN_ORDER_FILTER_OPTIONS,
  ADMIN_ORDER_TABS,
} from "../constants/orders";
import { AdminOrderDetailModal } from "../components/AdminOrderDetailModal";
import { AdminOrderStatusModal } from "../components/AdminOrderStatusModal";

export const AdminOrdersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<string>("ALL");

  // Modals state
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<AdminOrder | null>(null);
  const [targetStatusOrder, setTargetStatusOrder] = useState<AdminOrder | null>(null);

  // Determine query status: activeTab takes priority unless statusFilter is set to specific
  const effectiveStatus =
    activeTab !== "ALL"
      ? activeTab
      : statusFilter !== "ALL"
      ? statusFilter
      : undefined;

  // Data fetching
  const { data, isLoading, isFetching, refetch } = useAdminOrders({
    search: searchTerm.trim() || undefined,
    status: effectiveStatus,
  });

  const { mutate: updateStatus, isPending: isUpdating } = useUpdateAdminOrderStatus();

  const orders = useMemo(() => data?.results ?? [], [data?.results]);
  const totalCount = data?.count ?? orders.length;

  // Quick stats computed from current data
  const stats = useMemo(() => {
    let pending = 0;
    let processing = 0;
    let delivering = 0;
    let completed = 0;
    let cancelled = 0;

    orders.forEach((o) => {
      switch (o.status) {
        case "PENDING":
          pending++;
          break;
        case "PAID":
        case "PROCESSING":
          processing++;
          break;
        case "DELIVERING":
          delivering++;
          break;
        case "COMPLETED":
          completed++;
          break;
        case "CANCELLED":
          cancelled++;
          break;
      }
    });

    return {
      total: totalCount,
      pending,
      processing,
      delivering,
      completed,
      cancelled,
    };
  }, [orders, totalCount]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setStatusFilter(key);
  };

  const handleStatusFilterChange = (val: string) => {
    setStatusFilter(val);
    setActiveTab(val);
  };

  const handleConfirmStatusChange = (payload: {
    status: AdminOrderStatus;
    notes?: string;
  }) => {
    if (!targetStatusOrder) return;
    updateStatus(
      {
        id: targetStatusOrder.id,
        payload,
      },
      {
        onSuccess: () => {
          setTargetStatusOrder(null);
          // If the detail modal was viewing this order, update it too
          if (selectedOrderDetail && selectedOrderDetail.id === targetStatusOrder.id) {
            setSelectedOrderDetail((prev) =>
              prev ? { ...prev, status: payload.status, notes: payload.notes || prev.notes } : null
            );
          }
        },
      }
    );
  };

  // Table columns definition
  const columns: TableColumn<AdminOrder>[] = useMemo(
    () => [
      {
        key: "order_code",
        header: LABELS.admin.ORDERS_COL_CODE,
        render: (row) => (
          <div>
            <span className="font-mono font-bold text-surface-900 text-xs block">
              {row.order_code}
            </span>
            <span className="text-[11px] text-surface-400">
              {row.created_at
                ? new Intl.DateTimeFormat("vi-VN", {
                    dateStyle: "short",
                    timeStyle: "short",
                  }).format(new Date(row.created_at))
                : LABELS.admin.STATUS_UNAVAILABLE}
            </span>
          </div>
        ),
      },
      {
        key: "recipient",
        header: LABELS.admin.ORDERS_COL_CUSTOMER,
        render: (row) => (
          <div className="space-y-0.5">
            <p className="font-semibold text-surface-900 text-xs">
              {row.recipient_name}
            </p>
            <p className="text-[11px] text-surface-500 font-mono">
              {row.recipient_phone}
            </p>
            {row.user_email && (
              <p className="text-[10px] text-surface-400 truncate max-w-[160px]">
                {row.user_email}
              </p>
            )}
          </div>
        ),
      },
      {
        key: "items_count",
        header: LABELS.admin.ORDERS_COL_ITEMS_COUNT,
        align: "center",
        render: (row) => {
          const count = row.items_count ?? (row.details ? row.details.length : 0);
          return (
            <span className="text-xs font-medium text-surface-700 bg-surface-100 px-2.5 py-1 rounded-full">
              {LABELS.admin.ORDERS_ITEMS_COUNT_TEXT(count)}
            </span>
          );
        },
      },
      {
        key: "total_amount",
        header: LABELS.admin.ORDERS_COL_TOTAL,
        align: "right",
        render: (row) => {
          const amount =
            typeof row.total_amount === "string"
              ? parseFloat(row.total_amount) || 0
              : row.total_amount;
          return (
            <span className="font-bold text-brand-dark font-serif text-sm">
              {formatCurrencyVND(amount)}
            </span>
          );
        },
      },
      {
        key: "status",
        header: LABELS.admin.ORDERS_COL_STATUS,
        align: "center",
        render: (row) => {
          const config = ADMIN_ORDER_STATUS_CONFIG[row.status] ?? {
            label: row.status_display || row.status,
            variant: "default" as const,
            dotColor: "bg-surface-400",
          };
          return (
            <BadgeCommon
              variant={config.variant}
              size="sm"
              dot
              dotColor={config.dotColor}
            >
              {config.label}
            </BadgeCommon>
          );
        },
      },
      {
        key: "actions",
        header: LABELS.admin.ORDERS_COL_ACTIONS,
        align: "right",
        render: (row) => (
          <div className="flex items-center justify-end gap-1.5">
            <ButtonCommon
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs"
              title={LABELS.admin.ORDERS_ACTION_VIEW}
              onClick={() => setSelectedOrderDetail(row)}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {LABELS.admin.ORDERS_ACTION_VIEW}
              </span>
            </ButtonCommon>

            <ButtonCommon
              variant="secondary"
              size="sm"
              className="h-7 px-2 text-xs"
              title={LABELS.admin.ORDERS_ACTION_UPDATE_STATUS}
              onClick={() => setTargetStatusOrder(row)}
            >
              <Pencil className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {LABELS.admin.ORDERS_ACTION_UPDATE_STATUS}
              </span>
            </ButtonCommon>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900 font-serif">
            {LABELS.admin.ORDERS_MGMT_TITLE}
          </h1>
          <p className="text-xs text-surface-500 mt-1">
            {LABELS.admin.ORDERS_MGMT_DESCRIPTION}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ButtonCommon
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
            {LABELS.admin.ORDERS_ACTION_REFRESH}
          </ButtonCommon>
        </div>
      </div>

      {/* Quick Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl border border-surface-200/80 bg-white shadow-2xs">
          <div className="flex items-center gap-2 text-surface-500 mb-1">
            <ShoppingBag className="w-4 h-4 text-brand" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {LABELS.admin.ORDERS_TAB_ALL}
            </span>
          </div>
          <p className="text-xl font-bold text-surface-900">{stats.total}</p>
        </div>

        <div className="p-3.5 rounded-xl border border-amber-200/70 bg-amber-50/40 shadow-2xs">
          <div className="flex items-center gap-2 text-amber-700 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {LABELS.admin.ORDERS_STATUS_PENDING}
            </span>
          </div>
          <p className="text-xl font-bold text-amber-800">{stats.pending}</p>
        </div>

        <div className="p-3.5 rounded-xl border border-blue-200/70 bg-blue-50/40 shadow-2xs">
          <div className="flex items-center gap-2 text-blue-700 mb-1">
            <PackageCheck className="w-4 h-4" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {LABELS.admin.ORDERS_STATUS_PROCESSING}
            </span>
          </div>
          <p className="text-xl font-bold text-blue-800">{stats.processing}</p>
        </div>

        <div className="p-3.5 rounded-xl border border-indigo-200/70 bg-indigo-50/40 shadow-2xs">
          <div className="flex items-center gap-2 text-indigo-700 mb-1">
            <Truck className="w-4 h-4" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {LABELS.admin.ORDERS_STATUS_DELIVERING}
            </span>
          </div>
          <p className="text-xl font-bold text-indigo-800">{stats.delivering}</p>
        </div>

        <div className="p-3.5 rounded-xl border border-emerald-200/70 bg-emerald-50/40 shadow-2xs">
          <div className="flex items-center gap-2 text-emerald-700 mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {LABELS.admin.ORDERS_STATUS_COMPLETED}
            </span>
          </div>
          <p className="text-xl font-bold text-emerald-800">{stats.completed}</p>
        </div>

        <div className="p-3.5 rounded-xl border border-rose-200/70 bg-rose-50/40 shadow-2xs">
          <div className="flex items-center gap-2 text-rose-700 mb-1">
            <XCircle className="w-4 h-4" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {LABELS.admin.ORDERS_STATUS_CANCELLED}
            </span>
          </div>
          <p className="text-xl font-bold text-rose-800">{stats.cancelled}</p>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-surface-200 overflow-x-auto pb-px">
          {ADMIN_ORDER_TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTabChange(tab.key)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-colors whitespace-nowrap border-b-2 ${
                  isActive
                    ? "border-brand text-brand bg-brand/5"
                    : "border-transparent text-surface-500 hover:text-surface-900 hover:bg-surface-50"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Bar & Dropdown Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-surface-400">
              <Search className="w-4 h-4" />
            </div>
            <TextFieldCommon
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={LABELS.admin.ORDERS_SEARCH_PLACEHOLDER}
              className="pl-9 h-9 text-xs"
              aria-label={LABELS.admin.ORDERS_SEARCH_LABEL}
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-surface-500">
              <Filter className="w-3.5 h-3.5" />
              <span>{LABELS.admin.ORDERS_FILTER_STATUS_LABEL}:</span>
            </div>
            <div className="w-48">
              <SelectCommon
                options={ADMIN_ORDER_FILTER_OPTIONS}
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-surface-200 shadow-2xs overflow-hidden">
        <TableCommon
          columns={columns}
          data={orders}
          rowKey="id"
          isLoading={isLoading}
          emptyTitle={LABELS.admin.ORDERS_EMPTY_TITLE}
          emptyDescription={LABELS.admin.ORDERS_EMPTY_DESC}
          onRowClick={(row) => setSelectedOrderDetail(row)}
        />
      </div>

      {/* Order Detail Modal */}
      <AdminOrderDetailModal
        order={selectedOrderDetail}
        open={Boolean(selectedOrderDetail)}
        onClose={() => setSelectedOrderDetail(null)}
        onRequestChangeStatus={(order) => setTargetStatusOrder(order)}
      />

      {/* Order Status Update Modal */}
      <AdminOrderStatusModal
        order={targetStatusOrder}
        open={Boolean(targetStatusOrder)}
        isLoading={isUpdating}
        onClose={() => setTargetStatusOrder(null)}
        onConfirm={handleConfirmStatusChange}
      />
    </div>
  );
};
