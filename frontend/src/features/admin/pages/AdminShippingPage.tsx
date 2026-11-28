import React, { useState, useMemo } from "react";
import {
  Truck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Eye,
  UserCheck,
  RefreshCw,
  Search,
  Package,
} from "lucide-react";
import { LABELS } from "@/constants/labels";
import { ButtonCommon } from "@/components/common/ButtonCommon";
import { TextFieldCommon } from "@/components/common/TextFieldCommon";
import { SelectCommon } from "@/components/common/SelectCommon";
import { TableCommon, type TableColumn } from "@/components/common/TableCommon";
import { BadgeCommon } from "@/components/common/BadgeCommon";
import { formatCurrencyVND } from "@/utils/formatCurrency";
import {
  useAdminShipments,
  useAdminShippers,
  useUpdateAdminShipment,
} from "../hooks/useAdminShipping";
import {
  AdminShipment,
  UpdateAdminShipmentPayload,
} from "../types";
import {
  ADMIN_SHIPMENT_STATUS,
  ADMIN_SHIPMENT_STATUS_CONFIG,
  ADMIN_SHIPMENT_FILTER_STATUS_OPTIONS,
  ADMIN_SHIPMENT_TABS,
} from "../constants/shipping";
import { AdminShipmentDetailModal } from "../components/AdminShipmentDetailModal";
import { AdminShipmentAssignModal } from "../components/AdminShipmentAssignModal";
import { AdminShipmentConfirmModal } from "../components/AdminShipmentConfirmModal";

export const AdminShippingPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [shipperFilter, setShipperFilter] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<string>("ALL");

  // Modals state
  const [selectedDetail, setSelectedDetail] = useState<AdminShipment | null>(null);
  const [targetAssignShipment, setTargetAssignShipment] = useState<AdminShipment | null>(null);
  const [targetConfirmShipment, setTargetConfirmShipment] = useState<AdminShipment | null>(null);

  // Tab priority
  const effectiveStatus =
    activeTab !== "ALL"
      ? activeTab
      : statusFilter !== "ALL"
      ? statusFilter
      : undefined;

  // Data fetching
  const { data, isLoading, isFetching, refetch } = useAdminShipments({
    search: searchTerm.trim() || undefined,
    status: effectiveStatus,
    shipper: shipperFilter !== "ALL" ? shipperFilter : undefined,
  });

  const { data: shippersData } = useAdminShippers();
  const shippers = shippersData || [];

  const { mutate: updateShipment, isPending: isUpdating } = useUpdateAdminShipment();

  const shipments = useMemo(() => data?.results ?? [], [data?.results]);
  const totalCount = data?.count ?? shipments.length;

  // Compute stats
  const stats = useMemo(() => {
    let unassigned = 0;
    let delivering = 0;
    let pendingConfirm = 0;
    let completed = 0;

    shipments.forEach((s) => {
      switch (s.status) {
        case ADMIN_SHIPMENT_STATUS.PENDING:
        case ADMIN_SHIPMENT_STATUS.UNASSIGNED:
          unassigned++;
          break;
        case ADMIN_SHIPMENT_STATUS.ASSIGNED:
        case ADMIN_SHIPMENT_STATUS.SHIPPING:
        case ADMIN_SHIPMENT_STATUS.DELIVERING:
          delivering++;
          break;
        case ADMIN_SHIPMENT_STATUS.DELIVERED_PENDING_CONFIRM:
          pendingConfirm++;
          break;
        case ADMIN_SHIPMENT_STATUS.DELIVERED:
        case ADMIN_SHIPMENT_STATUS.COMPLETED:
          completed++;
          break;
      }
    });

    return {
      total: totalCount,
      unassigned,
      delivering,
      pendingConfirm,
      completed,
    };
  }, [shipments, totalCount]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setStatusFilter(key);
  };

  const handleStatusFilterChange = (val: string) => {
    setStatusFilter(val);
    setActiveTab(val);
  };

  const handleConfirmUpdate = (
    id: string,
    payload: UpdateAdminShipmentPayload,
    onSuccessCallback: () => void
  ) => {
    updateShipment(
      { id, payload },
      {
        onSuccess: () => {
          onSuccessCallback();
          if (selectedDetail && selectedDetail.id === id) {
            setSelectedDetail((prev) => (prev ? { ...prev, ...payload } : null));
          }
        },
      }
    );
  };

  const shipperFilterOptions = [
    { value: "ALL", label: LABELS.admin.SHIPPING_FILTER_ALL_SHIPPER },
    ...shippers.map((s) => ({
      value: s.id,
      label: s.full_name,
    })),
  ];

  // Table columns definition
  const columns: TableColumn<AdminShipment>[] = useMemo(
    () => [
      {
        key: "tracking_code",
        header: LABELS.admin.SHIPPING_COL_TRACKING,
        render: (row) => (
          <div>
            <span className="font-mono font-bold text-surface-900 text-xs block">
              {row.tracking_code || row.ship_code}
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
        header: LABELS.admin.SHIPPING_COL_ORDER,
        render: (row) => (
          <div className="space-y-0.5">
            <span className="font-mono text-xs font-semibold text-surface-800 block">
              {row.order_code}
            </span>
            {row.items_count !== undefined && (
              <span className="text-[11px] text-surface-400">
                {LABELS.admin.ORDERS_ITEMS_COUNT_TEXT(row.items_count)}
              </span>
            )}
          </div>
        ),
      },
      {
        key: "recipient",
        header: LABELS.admin.SHIPPING_COL_RECIPIENT,
        render: (row) => (
          <div className="space-y-0.5 max-w-[220px]">
            <p className="font-semibold text-surface-900 text-xs">
              {row.recipient_name}
            </p>
            <p className="text-[11px] text-surface-500 font-mono">
              {row.recipient_phone}
            </p>
            <p className="text-[10px] text-surface-400 truncate" title={row.shipping_address || row.delivery_address}>
              {row.shipping_address || row.delivery_address}
            </p>
          </div>
        ),
      },
      {
        key: "shipper",
        header: LABELS.admin.SHIPPING_COL_SHIPPER,
        render: (row) => (
          <div>
            {(row.shipper_name || row.staff_name) ? (
              <div>
                <p className="font-semibold text-surface-900 text-xs">
                  {row.shipper_name || row.staff_name}
                </p>
                {(row.shipper_phone || row.staff_phone) && (
                  <p className="text-[10px] text-surface-500 font-mono">
                    {row.shipper_phone || row.staff_phone}
                  </p>
                )}
              </div>
            ) : (
              <BadgeCommon variant="warning" size="sm">
                {LABELS.admin.SHIPPING_UNASSIGNED_BADGE}
              </BadgeCommon>
            )}
          </div>
        ),
      },
      {
        key: "cod_amount",
        header: LABELS.admin.SHIPPING_COL_COD,
        align: "right",
        render: (row) => {
          const cod =
            typeof row.cod_amount === "string"
              ? parseFloat(row.cod_amount) || 0
              : row.cod_amount;
          return (
            <span className="font-bold text-brand font-mono text-xs">
              {formatCurrencyVND(cod)}
            </span>
          );
        },
      },
      {
        key: "status",
        header: LABELS.admin.SHIPPING_COL_STATUS,
        align: "center",
        render: (row) => {
          const config = ADMIN_SHIPMENT_STATUS_CONFIG[row.status] ?? {
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
        header: LABELS.admin.SHIPPING_COL_ACTIONS,
        align: "right",
        render: (row) => {
          const hasShipper = Boolean(row.staff_name || row.shipper_name);
          const canAssign =
            row.status === ADMIN_SHIPMENT_STATUS.PENDING ||
            row.status === ADMIN_SHIPMENT_STATUS.UNASSIGNED ||
            (row.status === ADMIN_SHIPMENT_STATUS.ASSIGNED && !hasShipper);
          const canConfirm = row.status === ADMIN_SHIPMENT_STATUS.DELIVERED_PENDING_CONFIRM;

          return (
            <div className="flex items-center justify-end gap-1.5">
              <ButtonCommon
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
                title={LABELS.admin.SHIPPING_ACTION_VIEW}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDetail(row);
                }}
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {LABELS.admin.SHIPPING_ACTION_VIEW}
                </span>
              </ButtonCommon>

              <ButtonCommon
                variant="secondary"
                size="sm"
                disabled={!canAssign}
                className="h-7 px-2 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                title={LABELS.admin.SHIPPING_ACTION_ASSIGN}
                onClick={(e) => {
                  e.stopPropagation();
                  if (canAssign) setTargetAssignShipment(row);
                }}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {LABELS.admin.SHIPPING_ACTION_ASSIGN}
                </span>
              </ButtonCommon>

              <ButtonCommon
                variant="primary"
                size="sm"
                disabled={!canConfirm}
                className="h-7 px-2 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                title={LABELS.admin.SHIPPING_ACTION_CONFIRM_POD}
                onClick={(e) => {
                  e.stopPropagation();
                  if (canConfirm) setTargetConfirmShipment(row);
                }}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {LABELS.admin.SHIPPING_ACTION_CONFIRM_POD}
                </span>
              </ButtonCommon>
            </div>
          );
        },
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
            {LABELS.admin.SHIPPING_MGMT_TITLE}
          </h1>
          <p className="text-sm text-surface-500 mt-1">
            {LABELS.admin.SHIPPING_MGMT_DESCRIPTION}
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
            <span>{LABELS.admin.SHIPPING_ACTION_REFRESH}</span>
          </ButtonCommon>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total */}
        <div className="p-4 rounded-xl border border-surface-200/80 bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
              {LABELS.admin.SHIPPING_TAB_ALL}
            </span>
            <div className="w-8 h-8 rounded-lg bg-surface-100 text-surface-700 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-surface-900 mt-2 font-mono">
            {stats.total}
          </p>
        </div>

        {/* Unassigned */}
        <div className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              {LABELS.admin.SHIPPING_TAB_UNASSIGNED}
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-900 mt-2 font-mono">
            {stats.unassigned}
          </p>
        </div>

        {/* Delivering */}
        <div className="p-4 rounded-xl border border-indigo-200/80 bg-indigo-50/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
              {LABELS.admin.SHIPPING_TAB_DELIVERING}
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-indigo-900 mt-2 font-mono">
            {stats.delivering}
          </p>
        </div>

        {/* Pending Confirm POD */}
        <div className="p-4 rounded-xl border border-purple-200/80 bg-purple-50/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
              {LABELS.admin.SHIPPING_TAB_DELIVERED_PENDING}
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-purple-900 mt-2 font-mono">
            {stats.pendingConfirm}
          </p>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="space-y-3 bg-white p-4 rounded-xl border border-surface-200/80 shadow-xs">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-surface-100">
          {ADMIN_SHIPMENT_TABS.map((tab) => {
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
              id="shipping-search-input"
              type="search"
              hideLabel
              label={LABELS.admin.SHIPPING_SEARCH_LABEL}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={LABELS.admin.SHIPPING_SEARCH_PLACEHOLDER}
              className="w-full text-xs pl-9"
            />
          </div>

          {/* Shipper Filter */}
          <div className="sm:col-span-3">
            <SelectCommon
              id="shipping-shipper-filter"
              label={LABELS.admin.SHIPPING_FILTER_SHIPPER}
              hideLabel
              value={shipperFilter}
              onChange={(e) => setShipperFilter(e.target.value)}
              options={shipperFilterOptions}
              className="w-full text-xs"
            />
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <SelectCommon
              id="shipping-status-filter"
              label={LABELS.admin.SHIPPING_FILTER_STATUS}
              hideLabel
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              options={ADMIN_SHIPMENT_FILTER_STATUS_OPTIONS}
              className="w-full text-xs"
            />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-surface-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-surface-100 flex items-center justify-between">
          <p className="text-xs font-semibold text-surface-700">
            {LABELS.admin.SHIPPING_TOTAL(totalCount)}
          </p>
        </div>

        <TableCommon
          columns={columns}
          data={shipments}
          rowKey="id"
          isLoading={isLoading}
          emptyTitle={LABELS.admin.SHIPPING_EMPTY_TITLE}
          emptyDescription={LABELS.admin.SHIPPING_EMPTY_DESC}
          onRowClick={(row) => setSelectedDetail(row)}
        />
      </div>

      {/* Detail Modal */}
      <AdminShipmentDetailModal
        shipment={selectedDetail}
        open={Boolean(selectedDetail)}
        onClose={() => setSelectedDetail(null)}
        onRequestAssign={(item) => {
          setSelectedDetail(null);
          setTargetAssignShipment(item);
        }}
        onRequestConfirmPOD={(item) => {
          setSelectedDetail(null);
          setTargetConfirmShipment(item);
        }}
      />

      {/* Assign Shipper Modal */}
      <AdminShipmentAssignModal
        shipment={targetAssignShipment}
        shippers={shippers}
        open={Boolean(targetAssignShipment)}
        isLoading={isUpdating}
        onClose={() => setTargetAssignShipment(null)}
        onConfirm={(payload) => {
          if (!targetAssignShipment) return;
          handleConfirmUpdate(targetAssignShipment.id, payload, () => {
            setTargetAssignShipment(null);
          });
        }}
      />

      {/* Confirm POD Modal */}
      <AdminShipmentConfirmModal
        shipment={targetConfirmShipment}
        open={Boolean(targetConfirmShipment)}
        isLoading={isUpdating}
        onClose={() => setTargetConfirmShipment(null)}
        onConfirm={(payload) => {
          if (!targetConfirmShipment) return;
          handleConfirmUpdate(targetConfirmShipment.id, payload, () => {
            setTargetConfirmShipment(null);
          });
        }}
      />
    </div>
  );
};
