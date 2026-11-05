import React, { useState, useMemo } from "react";
import {
  UserCheck,
  UserX,
  Eye,
  Shield,
  User as UserIcon,
  Phone,
  Mail,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { LABELS } from "@/constants/labels";
import { ButtonCommon } from "@/components/common/ButtonCommon";
import { TextFieldCommon } from "@/components/common/TextFieldCommon";
import { SelectCommon, type SelectOption } from "@/components/common/SelectCommon";
import { TableCommon, type TableColumn } from "@/components/common/TableCommon";
import { ModalCommon } from "@/components/common/ModalCommon";
import { useAdminUsers, useUpdateAdminUser } from "../hooks/useAdminUsers";
import { AdminUser } from "../types";

export const AdminCustomersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  // Selected user for Detail Modal
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // Selected user for Lock/Unlock Confirm Modal
  const [targetToggleUser, setTargetToggleUser] = useState<AdminUser | null>(null);

  // Fetch real user data from backend
  const { data, isLoading, isFetching, refetch } = useAdminUsers({
    search: searchTerm.trim() || undefined,
    role: roleFilter !== "ALL" ? roleFilter : undefined,
    is_active:
      statusFilter === "ACTIVE"
        ? true
        : statusFilter === "BLOCKED"
        ? false
        : undefined,
  });

  const { mutate: updateUser, isPending: isUpdating } = useUpdateAdminUser();

  const users = data?.results ?? [];
  const totalCount = data?.count ?? users.length;

  const handleConfirmToggle = () => {
    if (!targetToggleUser) return;
    updateUser(
      {
        id: targetToggleUser.id,
        payload: { is_active: !targetToggleUser.is_active },
      },
      {
        onSettled: () => setTargetToggleUser(null),
      }
    );
  };

  const getInitials = (name?: string, email?: string) => {
    if (name && name.trim()) {
      return name
        .trim()
        .split(" ")
        .filter(Boolean)
        .slice(-2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();
    }
    return email ? email.substring(0, 2).toUpperCase() : "KH";
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return "—";
    try {
      return new Date(isoString).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  const statusOptions: readonly SelectOption[] = [
    { value: "ALL", label: LABELS.admin.CUSTOMERS_FILTER_ALL },
    { value: "ACTIVE", label: LABELS.admin.CUSTOMERS_FILTER_ACTIVE },
    { value: "BLOCKED", label: LABELS.admin.CUSTOMERS_FILTER_BLOCKED },
  ];

  const roleOptions: readonly SelectOption[] = [
    { value: "ALL", label: LABELS.admin.CUSTOMERS_ROLE_ALL },
    { value: "CUSTOMER", label: LABELS.admin.CUSTOMERS_ROLE_CUSTOMER },
    { value: "ADMIN", label: LABELS.admin.CUSTOMERS_ROLE_ADMIN },
  ];

  // Định nghĩa các cột cho TableCommon
  const columns: TableColumn<AdminUser>[] = useMemo(
    () => [
      {
        key: "user",
        header: LABELS.admin.CUSTOMERS_COL_USER,
        render: (user) => {
          const initials = getInitials(user.full_name, user.email);
          return (
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-brand/10 text-brand font-bold text-xs flex items-center justify-center shrink-0 ring-2 ring-brand/10">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-surface-900 truncate">
                  {user.full_name?.trim() ||
                    user.email ||
                    LABELS.profile.NOT_PROVIDED}
                </p>
                <p className="text-xs text-surface-400 truncate mt-0.5">{user.email}</p>
              </div>
            </div>
          );
        },
      },
      {
        key: "phone",
        header: LABELS.admin.CUSTOMERS_COL_CONTACT,
        render: (user) =>
          user.phone ? (
            <div className="flex items-center gap-1.5 text-xs text-surface-700 font-medium">
              <Phone className="w-3.5 h-3.5 text-surface-400 shrink-0" />
              <span>{user.phone}</span>
            </div>
          ) : (
            <span className="text-xs text-surface-400 italic">
              {LABELS.profile.NOT_PROVIDED}
            </span>
          ),
      },
      {
        key: "role",
        header: LABELS.admin.CUSTOMERS_COL_ROLE,
        render: (user) => {
          const isAdminRole = user.role === "ADMIN";
          return (
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border shadow-2xs ${
                isAdminRole
                  ? "bg-purple-50 text-purple-700 border-purple-200/70"
                  : "bg-surface-100 text-surface-700 border-surface-200/80"
              }`}
            >
              {isAdminRole ? (
                <Shield className="w-3 h-3 text-purple-600" />
              ) : (
                <UserIcon className="w-3 h-3 text-surface-500" />
              )}
              <span>
                {isAdminRole
                  ? LABELS.admin.CUSTOMERS_ROLE_ADMIN
                  : LABELS.admin.CUSTOMERS_ROLE_CUSTOMER}
              </span>
            </span>
          );
        },
      },
      {
        key: "is_active",
        header: LABELS.admin.CUSTOMERS_COL_STATUS,
        render: (user) => (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border shadow-2xs ${
              user.is_active
                ? "bg-emerald-50 text-emerald-700 border-emerald-200/70"
                : "bg-rose-50 text-rose-700 border-rose-200/70"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                user.is_active ? "bg-emerald-500" : "bg-rose-500"
              }`}
            />
            <span>
              {user.is_active
                ? LABELS.admin.CUSTOMERS_STATUS_ACTIVE
                : LABELS.admin.CUSTOMERS_STATUS_BLOCKED}
            </span>
          </span>
        ),
      },
      {
        key: "date_joined",
        header: LABELS.admin.CUSTOMERS_COL_JOINED,
        render: (user) => (
          <span className="text-xs font-medium text-surface-500">
            {formatDate(user.date_joined || user.created_at)}
          </span>
        ),
      },
      {
        key: "actions",
        header: LABELS.admin.CUSTOMERS_COL_ACTIONS,
        align: "right",
        render: (user) => (
          <div className="flex items-center justify-end gap-1">
            {/* View detail button */}
            <ButtonCommon
              variant="ghost"
              size="sm"
              onClick={() => setSelectedUser(user)}
              className="w-8 h-8 p-0 rounded-lg text-surface-500 hover:text-brand hover:bg-brand/10 transition-colors"
              title={LABELS.admin.CUSTOMERS_ACTION_VIEW}
              aria-label={LABELS.admin.CUSTOMERS_ACTION_VIEW}
            >
              <Eye className="w-4 h-4" />
            </ButtonCommon>

            {/* Toggle lock/unlock account */}
            <ButtonCommon
              variant="ghost"
              size="sm"
              onClick={() => setTargetToggleUser(user)}
              className={`w-8 h-8 p-0 rounded-lg transition-colors ${
                user.is_active
                  ? "text-surface-400 hover:text-rose-600 hover:bg-rose-50"
                  : "text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50"
              }`}
              title={
                user.is_active
                  ? LABELS.admin.CUSTOMERS_ACTION_LOCK
                  : LABELS.admin.CUSTOMERS_ACTION_UNLOCK
              }
              aria-label={
                user.is_active
                  ? LABELS.admin.CUSTOMERS_ACTION_LOCK
                  : LABELS.admin.CUSTOMERS_ACTION_UNLOCK
              }
            >
              {user.is_active ? (
                <UserX className="w-4 h-4" />
              ) : (
                <UserCheck className="w-4 h-4" />
              )}
            </ButtonCommon>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6 relative">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight font-sans">
            {LABELS.admin.CUSTOMERS_TITLE}
          </h1>
          <p className="text-xs sm:text-sm text-surface-500 mt-1">
            {LABELS.admin.CUSTOMERS_DESCRIPTION}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-brand/10 text-brand border border-brand/20 shadow-2xs">
            {LABELS.admin.CUSTOMERS_TOTAL(totalCount)}
          </span>

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
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-surface-200/80 shadow-xs p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {/* Search Input using TextFieldCommon */}
          <div className="flex-1">
            <TextFieldCommon
              type="search"
              label={LABELS.admin.CUSTOMERS_SEARCH_PLACEHOLDER}
              hideLabel
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={LABELS.admin.CUSTOMERS_SEARCH_PLACEHOLDER}
              className="text-xs h-10 bg-surface-50/50 border-surface-200 rounded-lg focus:bg-white"
            />
          </div>

          {/* Filter by Status & Role */}
          <div className="flex items-center gap-3">
            <SelectCommon
              label={LABELS.admin.CUSTOMERS_FILTER_STATUS}
              hideLabel
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs h-10 min-w-[150px] bg-surface-50/50 border-surface-200 rounded-lg"
            />

            <SelectCommon
              label={LABELS.admin.CUSTOMERS_FILTER_ROLE}
              hideLabel
              options={roleOptions}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="text-xs h-10 min-w-[140px] bg-surface-50/50 border-surface-200 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Users Data Table using TableCommon */}
      <div className="bg-white rounded-2xl border border-surface-200/80 shadow-xs overflow-hidden">
        <TableCommon
          columns={columns}
          data={users}
          rowKey="id"
          isLoading={isLoading}
          emptyTitle={LABELS.admin.CUSTOMERS_EMPTY_TITLE}
          emptyDescription={LABELS.admin.CUSTOMERS_EMPTY_DESC}
        />
      </div>

      {/* Modal: Customer Details */}
      <ModalCommon
        open={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
        title={LABELS.admin.CUSTOMERS_MODAL_TITLE}
      >
        {selectedUser && (
          <div className="space-y-4 text-xs">
            {/* Header profile preview */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-surface-50 border border-surface-100">
              <div className="w-12 h-12 rounded-full bg-brand/10 text-brand text-base font-bold flex items-center justify-center shrink-0 ring-2 ring-brand/10">
                {getInitials(selectedUser.full_name, selectedUser.email)}
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold text-surface-900 truncate">
                  {selectedUser.full_name?.trim() ||
                    selectedUser.email ||
                    LABELS.profile.NOT_PROVIDED}
                </p>
                <p className="text-xs text-surface-500 truncate mt-0.5">
                  {selectedUser.email}
                </p>
              </div>
            </div>

            {/* Field rows */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-surface-50/70 border border-surface-100">
                <span className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <Mail className="w-3.5 h-3.5 text-surface-400" />
                  {LABELS.auth.EMAIL}
                </span>
                <p className="font-semibold text-xs text-surface-900 break-all">
                  {selectedUser.email}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface-50/70 border border-surface-100">
                <span className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <Phone className="w-3.5 h-3.5 text-surface-400" />
                  {LABELS.auth.PHONE_OPTIONAL}
                </span>
                <p className="font-semibold text-xs text-surface-900">
                  {selectedUser.phone || LABELS.profile.NOT_PROVIDED}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface-50/70 border border-surface-100">
                <span className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <Shield className="w-3.5 h-3.5 text-surface-400" />
                  {LABELS.profile.ROLE}
                </span>
                <p className="font-semibold text-xs text-surface-900">
                  {selectedUser.role === "ADMIN"
                    ? LABELS.admin.CUSTOMERS_ROLE_ADMIN
                    : LABELS.admin.CUSTOMERS_ROLE_CUSTOMER}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface-50/70 border border-surface-100">
                <span className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <Calendar className="w-3.5 h-3.5 text-surface-400" />
                  {LABELS.admin.CUSTOMERS_COL_JOINED}
                </span>
                <p className="font-semibold text-xs text-surface-900">
                  {formatDate(
                    selectedUser.date_joined || selectedUser.created_at
                  )}
                </p>
              </div>
            </div>

            {/* Account Status Box */}
            <div className="p-3.5 rounded-xl border border-surface-200/80 bg-white flex items-center justify-between shadow-2xs">
              <div>
                <p className="font-semibold text-xs text-surface-900">
                  {LABELS.profile.STATUS}
                </p>
                <p className="text-[11px] text-surface-400 mt-0.5">
                  {selectedUser.is_active
                    ? LABELS.admin.CUSTOMERS_STATUS_ACTIVE
                    : LABELS.admin.CUSTOMERS_STATUS_BLOCKED}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${
                  selectedUser.is_active
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                    : "bg-rose-50 text-rose-700 border-rose-200/80"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    selectedUser.is_active ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                />
                {selectedUser.is_active
                  ? LABELS.admin.CUSTOMERS_STATUS_ACTIVE
                  : LABELS.admin.CUSTOMERS_STATUS_BLOCKED}
              </span>
            </div>

            {/* Modal actions */}
            <div className="pt-3 border-t border-surface-100 flex justify-end gap-2">
              <ButtonCommon
                variant="outline"
                size="sm"
                onClick={() => setSelectedUser(null)}
                className="rounded-lg text-xs"
              >
                {LABELS.common.CLOSE}
              </ButtonCommon>
            </div>
          </div>
        )}
      </ModalCommon>

      {/* Modal: Confirm Lock / Unlock */}
      <ModalCommon
        open={Boolean(targetToggleUser)}
        onClose={() => setTargetToggleUser(null)}
        title={
          targetToggleUser?.is_active
            ? LABELS.admin.CUSTOMERS_ACTION_LOCK
            : LABELS.admin.CUSTOMERS_ACTION_UNLOCK
        }
      >
        {targetToggleUser && (
          <div className="space-y-4 text-xs">
            <p className="text-surface-600 text-sm leading-relaxed">
              {targetToggleUser.is_active
                ? LABELS.admin.CUSTOMERS_CONFIRM_LOCK(
                    targetToggleUser.full_name || targetToggleUser.email
                  )
                : LABELS.admin.CUSTOMERS_CONFIRM_UNLOCK(
                    targetToggleUser.full_name || targetToggleUser.email
                  )}
            </p>

            <div className="pt-3 border-t border-surface-100 flex items-center justify-end gap-2">
              <ButtonCommon
                variant="outline"
                size="sm"
                onClick={() => setTargetToggleUser(null)}
                disabled={isUpdating}
                className="rounded-lg text-xs"
              >
                {LABELS.common.CLOSE}
              </ButtonCommon>

              <ButtonCommon
                variant={targetToggleUser.is_active ? "danger" : "brand"}
                size="sm"
                onClick={handleConfirmToggle}
                isLoading={isUpdating}
                className="rounded-lg text-xs"
              >
                {targetToggleUser.is_active
                  ? LABELS.admin.CUSTOMERS_ACTION_LOCK
                  : LABELS.admin.CUSTOMERS_ACTION_UNLOCK}
              </ButtonCommon>
            </div>
          </div>
        )}
      </ModalCommon>
    </div>
  );
};
