import React, { useState, useMemo } from "react";
import {
  RotateCcw,
  Clock,
  CheckCircle2,
  Eye,
  Pencil,
  RefreshCw,
  Search,
  Leaf,
  AlertTriangle,
} from "lucide-react";
import { LABELS } from "@/constants/labels";
import { ButtonCommon } from "@/components/common/ButtonCommon";
import { TextFieldCommon } from "@/components/common/TextFieldCommon";
import { SelectCommon } from "@/components/common/SelectCommon";
import { TableCommon, type TableColumn } from "@/components/common/TableCommon";
import { BadgeCommon } from "@/components/common/BadgeCommon";
import { useAdminReturns, useUpdateAdminReturn } from "../hooks/useAdminReturns";
import {
  AdminReturnRequest,
  UpdateAdminReturnPayload,
} from "../types";
import {
  ADMIN_RETURN_STATUS_CONFIG,
  ADMIN_RETURN_TYPE_LABELS,
  ADMIN_RETURN_REASON_LABELS,
  ADMIN_RETURN_FILTER_STATUS_OPTIONS,
  ADMIN_RETURN_FILTER_TYPE_OPTIONS,
  ADMIN_RETURN_TABS,
} from "../constants/returns";
import { AdminReturnDetailModal } from "../components/AdminReturnDetailModal";
import { AdminReturnActionModal } from "../components/AdminReturnActionModal";

export const AdminReturnsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<string>("ALL");

  // Modals state
  const [selectedReturnDetail, setSelectedReturnDetail] = useState<AdminReturnRequest | null>(null);
  const [targetActionReturn, setTargetActionReturn] = useState<AdminReturnRequest | null>(null);

  // Determine query status: activeTab takes priority unless statusFilter is set to specific
  const effectiveStatus =
    activeTab !== "ALL"
      ? activeTab
      : statusFilter !== "ALL"
      ? statusFilter
      : undefined;

  // Data fetching
  const { data, isLoading, isFetching, refetch } = useAdminReturns({
    search: searchTerm.trim() || undefined,
    status: effectiveStatus,
    request_type: typeFilter !== "ALL" ? typeFilter : undefined,
  });

  const { mutate: updateReturn, isPending: isUpdating } = useUpdateAdminReturn();

  const returnRequests = useMemo(() => data?.results ?? [], [data?.results]);
  const totalCount = data?.count ?? returnRequests.length;

  // Quick stats computed from current data
  const stats = useMemo(() => {
    let pending = 0;
    let approved = 0;
    let completed = 0;
    let rejected = 0;

    returnRequests.forEach((r) => {
      switch (r.status) {
        case "PENDING":
          pending++;
          break;
        case "APPROVED":
          approved++;
          break;
        case "COMPLETED":
          completed++;
          break;
        case "REJECTED":
          rejected++;
          break;
      }
    });

    return {
      total: totalCount,
      pending,
      approved,
      completed,
      rejected,
    };
  }, [returnRequests, totalCount]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setStatusFilter(key);
  };

  const handleStatusFilterChange = (val: string) => {
    setStatusFilter(val);
    setActiveTab(val);
  };

  const handleConfirmAction = (payload: UpdateAdminReturnPayload) => {
    if (!targetActionReturn) return;
    updateReturn(
      {
        id: targetActionReturn.id,
        payload,
      },
      {
        onSuccess: () => {
          setTargetActionReturn(null);
          // If the detail modal was viewing this return, update it too
          if (selectedReturnDetail && selectedReturnDetail.id === targetActionReturn.id) {
            setSelectedReturnDetail((prev) =>
              prev
                ? {
                    ...prev,
                    status: payload.status,
                    admin_notes: payload.admin_notes || prev.admin_notes,
                    resolution_action: payload.resolution_action || prev.resolution_action,
                    refund_amount: payload.refund_amount ?? prev.refund_amount,
                  }
                : null
            );
          }
        },
      }
    );
  };

  // Table columns definition
  const columns: TableColumn<AdminReturnRequest>[] = useMemo(
    () => [
      {
        key: "return_code",
        header: LABELS.admin.RETURNS_COL_CODE,
        render: (row) => (
          <div>
            <span className="font-mono font-bold text-surface-900 text-xs block">
              {row.return_code}
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
        key: "order_code",
        header: LABELS.admin.RETURNS_COL_ORDER_CODE,
        render: (row) => (
          <span className="font-mono text-xs font-semibold text-surface-800">
            {row.order_code}
          </span>
        ),
      },
      {
        key: "customer",
        header: LABELS.admin.RETURNS_COL_CUSTOMER,
        render: (row) => (
          <div className="space-y-0.5">
            <p className="font-semibold text-surface-900 text-xs">
              {row.user_name || LABELS.admin.STATUS_UNAVAILABLE}
            </p>
            {row.user_phone && (
              <p className="text-[11px] text-surface-500 font-mono">
                {row.user_phone}
              </p>
            )}
            {row.user_email && (
              <p className="text-[10px] text-surface-400 truncate max-w-[150px]">
                {row.user_email}
              </p>
            )}
          </div>
        ),
      },
      {
        key: "plant",
        header: LABELS.admin.RETURNS_COL_PLANT,
        render: (row) => (
          <div className="flex items-center gap-2 max-w-[200px]">
            {row.plant_image ? (
              <img
                src={row.plant_image}
                alt=""
                className="w-9 h-9 rounded-lg object-cover border border-surface-200 shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-surface-100 border border-surface-200 flex items-center justify-center text-surface-400 shrink-0">
                <Leaf className="w-4 h-4" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold text-surface-900 truncate">
                {row.plant_name || LABELS.admin.STATUS_UNAVAILABLE}
              </p>
              {row.plant_sku && (
                <p className="text-[10px] text-surface-400 font-mono">
                  {row.plant_sku}
                </p>
              )}
            </div>
          </div>
        ),
      },
      {
        key: "quantity",
        header: LABELS.admin.RETURNS_COL_QUANTITY,
        align: "center",
        render: (row) => (
          <span className="text-xs font-bold text-surface-800 bg-surface-100 px-2 py-0.5 rounded-full">
            {row.quantity}
          </span>
        ),
      },
      {
        key: "type",
        header: LABELS.admin.RETURNS_COL_TYPE,
        render: (row) => {
          const typeText =
            row.request_type_display ||
            ADMIN_RETURN_TYPE_LABELS[row.request_type] ||
            row.request_type;
          return <span className="text-xs font-medium text-surface-700">{typeText}</span>;
        },
      },
      {
        key: "reason",
        header: LABELS.admin.RETURNS_COL_REASON,
        render: (row) => {
          const reasonText =
            row.reason_display ||
            ADMIN_RETURN_REASON_LABELS[row.reason] ||
            row.reason;
          return (
            <span
              className="text-xs text-surface-600 block max-w-[160px] truncate"
              title={reasonText}
            >
              {reasonText}
            </span>
          );
        },
      },
      {
        key: "status",
        header: LABELS.admin.RETURNS_COL_STATUS,
        align: "center",
        render: (row) => {
          const config = ADMIN_RETURN_STATUS_CONFIG[row.status] ?? {
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
        header: LABELS.admin.RETURNS_COL_ACTIONS,
        align: "right",
        render: (row) => (
          <div className="flex items-center justify-end gap-1.5">
            <ButtonCommon
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs"
              title={LABELS.admin.RETURNS_ACTION_VIEW}
              onClick={() => setSelectedReturnDetail(row)}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {LABELS.admin.RETURNS_ACTION_VIEW}
              </span>
            </ButtonCommon>

            <ButtonCommon
              variant="secondary"
              size="sm"
              className="h-7 px-2 text-xs"
              title={LABELS.admin.RETURNS_ACTION_REVIEW}
              onClick={() => setTargetActionReturn(row)}
            >
              <Pencil className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {LABELS.admin.RETURNS_ACTION_REVIEW}
              </span>
            </ButtonCommon>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-surface-900 tracking-tight">
            {LABELS.admin.RETURNS_MGMT_TITLE}
          </h1>
          <p className="text-sm text-surface-500 mt-1">
            {LABELS.admin.RETURNS_MGMT_DESCRIPTION}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <ButtonCommon
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading || isFetching}
            className="flex items-center gap-1.5"
          >
            <RefreshCw
              className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
            />
            <span>{LABELS.admin.RETURNS_ACTION_REFRESH}</span>
          </ButtonCommon>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total */}
        <div className="p-4 rounded-xl border border-surface-200/80 bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
              {LABELS.admin.RETURNS_TAB_ALL}
            </span>
            <div className="w-8 h-8 rounded-lg bg-surface-100 text-surface-700 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-surface-900 mt-2 font-mono">
            {stats.total}
          </p>
        </div>

        {/* Pending */}
        <div className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              {LABELS.admin.RETURNS_TAB_PENDING}
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-900 mt-2 font-mono">
            {stats.pending}
          </p>
        </div>

        {/* Approved */}
        <div className="p-4 rounded-xl border border-blue-200/80 bg-blue-50/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
              {LABELS.admin.RETURNS_TAB_APPROVED}
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-900 mt-2 font-mono">
            {stats.approved}
          </p>
        </div>

        {/* Completed */}
        <div className="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              {LABELS.admin.RETURNS_TAB_COMPLETED}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-900 mt-2 font-mono">
            {stats.completed}
          </p>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="space-y-3 bg-white p-4 rounded-xl border border-surface-200/80 shadow-xs">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-surface-100">
          {ADMIN_RETURN_TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <ButtonCommon
                key={tab.key}
                type="button"
                variant={isActive ? "primary" : "ghost"}
                size="sm"
                onClick={() => handleTabChange(tab.key)}
                className="text-xs font-medium whitespace-nowrap"
              >
                {tab.label}
              </ButtonCommon>
            );
          })}
        </div>

        {/* Search & Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1 items-center">
          {/* Search via TextFieldCommon */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 z-10 pointer-events-none" />
            <TextFieldCommon
              id="return-search-input"
              type="search"
              hideLabel
              label={LABELS.admin.RETURNS_SEARCH_LABEL}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={LABELS.admin.RETURNS_SEARCH_PLACEHOLDER}
              className="w-full text-xs pl-9"
            />
          </div>

          {/* Type Filter */}
          <div className="sm:col-span-3">
            <SelectCommon
              id="return-type-filter"
              label={LABELS.admin.RETURNS_FILTER_TYPE}
              hideLabel
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={ADMIN_RETURN_FILTER_TYPE_OPTIONS}
              className="w-full text-xs"
            />
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <SelectCommon
              id="return-status-filter"
              label={LABELS.admin.RETURNS_FILTER_STATUS}
              hideLabel
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              options={ADMIN_RETURN_FILTER_STATUS_OPTIONS}
              className="w-full text-xs"
            />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-surface-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-surface-100 flex items-center justify-between">
          <p className="text-xs font-semibold text-surface-700">
            {LABELS.admin.RETURNS_TOTAL(totalCount)}
          </p>
        </div>

        <TableCommon
          columns={columns}
          data={returnRequests}
          rowKey="id"
          isLoading={isLoading}
          emptyTitle={LABELS.admin.RETURNS_EMPTY_TITLE}
          emptyDescription={LABELS.admin.RETURNS_EMPTY_DESC}
          onRowClick={(row) => setSelectedReturnDetail(row)}
        />
      </div>

      {/* Detail Modal */}
      <AdminReturnDetailModal
        returnRequest={selectedReturnDetail}
        open={Boolean(selectedReturnDetail)}
        onClose={() => setSelectedReturnDetail(null)}
        onRequestAction={(item) => {
          setSelectedReturnDetail(null);
          setTargetActionReturn(item);
        }}
      />

      {/* Action / Review Modal */}
      <AdminReturnActionModal
        returnRequest={targetActionReturn}
        open={Boolean(targetActionReturn)}
        isLoading={isUpdating}
        onClose={() => setTargetActionReturn(null)}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
};
