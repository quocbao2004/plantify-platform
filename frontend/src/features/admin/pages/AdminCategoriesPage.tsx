import React, { useState, useMemo } from "react";
import {
  FolderTree,
  Plus,
  RefreshCw,
  Search,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  Leaf,
  Layers,
} from "lucide-react";
import { Link } from "react-router-dom";
import { LABELS } from "@/constants/labels";
import { ButtonCommon } from "@/components/common/ButtonCommon";
import { TextFieldCommon } from "@/components/common/TextFieldCommon";
import { SelectCommon, type SelectOption } from "@/components/common/SelectCommon";
import { TableCommon, type TableColumn } from "@/components/common/TableCommon";
import { BadgeCommon } from "@/components/common/BadgeCommon";
import {
  useAdminCategories,
  useCreateAdminCategory,
  useUpdateAdminCategory,
  useDeleteAdminCategory,
} from "../hooks/useAdminCategories";
import { AdminCategory, CreateAdminCategoryPayload } from "../types";
import { AdminCategoryFormModal } from "../components/AdminCategoryFormModal";
import { AdminCategoryDeleteModal } from "../components/AdminCategoryDeleteModal";

export const AdminCategoriesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<AdminCategory | null>(null);

  // Data fetching
  const { data, isLoading, isFetching, refetch } = useAdminCategories({
    search: searchTerm.trim() || undefined,
    is_active: statusFilter === "ACTIVE" ? "true" : statusFilter === "INACTIVE" ? "false" : "all",
  });

  const { mutate: createCategory, isPending: isCreating } = useCreateAdminCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateAdminCategory();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteAdminCategory();

  const categories = useMemo(() => data?.results ?? [], [data?.results]);

  // Client-side search filter for responsive UI
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchSearch =
        !searchTerm.trim() ||
        cat.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        cat.slug.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        Boolean(cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase().trim()));

      const matchStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && cat.is_active) ||
        (statusFilter === "INACTIVE" && !cat.is_active);

      return matchSearch && matchStatus;
    });
  }, [categories, searchTerm, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    let active = 0;
    let inactive = 0;
    categories.forEach((c) => {
      if (c.is_active) active++;
      else inactive++;
    });
    return {
      total: categories.length,
      active,
      inactive,
    };
  }, [categories]);

  const statusFilterOptions: SelectOption[] = useMemo(
    () => [
      { value: "ALL", label: LABELS.admin.CATEGORIES_FILTER_ALL_STATUS },
      { value: "ACTIVE", label: LABELS.admin.CATEGORIES_STATUS_ACTIVE },
      { value: "INACTIVE", label: LABELS.admin.CATEGORIES_STATUS_INACTIVE },
    ],
    []
  );

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (cat: AdminCategory) => {
    setEditingCategory(cat);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (payload: CreateAdminCategoryPayload) => {
    if (editingCategory) {
      updateCategory(
        { id: editingCategory.id, payload },
        {
          onSuccess: () => {
            setIsFormModalOpen(false);
            setEditingCategory(null);
          },
        }
      );
    } else {
      createCategory(payload, {
        onSuccess: () => {
          setIsFormModalOpen(false);
        },
      });
    }
  };

  const handleDeleteConfirm = (cat: AdminCategory) => {
    deleteCategory(cat.id, {
      onSuccess: () => {
        setDeletingCategory(null);
      },
    });
  };

  // Table Columns
  const columns: TableColumn<AdminCategory>[] = useMemo(
    () => [
      {
        key: "name",
        header: LABELS.admin.CATEGORIES_COL_NAME,
        render: (row) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center shrink-0 border border-brand/20">
              <FolderTree className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-surface-900 text-xs">{row.name}</p>
              <p className="text-[11px] text-surface-400 font-mono mt-0.5">
                {row.slug}
              </p>
            </div>
          </div>
        ),
      },
      {
        key: "description",
        header: LABELS.admin.CATEGORIES_COL_DESCRIPTION,
        render: (row) => (
          <p className="text-xs text-surface-600 line-clamp-2 max-w-sm">
            {row.description || (
              <span className="text-surface-400 italic">
                {LABELS.admin.STATUS_UNAVAILABLE}
              </span>
            )}
          </p>
        ),
      },
      {
        key: "plants_count",
        header: LABELS.admin.CATEGORIES_COL_PLANTS_COUNT,
        align: "center",
        render: (row) => {
          const count = row.plants_count ?? 0;
          return (
            <Link
              to={`/admin/plants?category=${row.id}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-100 hover:bg-brand/10 hover:text-brand text-surface-700 text-xs font-semibold transition-colors"
              title={LABELS.admin.CATEGORIES_ACTION_VIEW_PLANTS}
            >
              <Leaf className="w-3 h-3 text-brand" />
              <span>{LABELS.admin.CATEGORIES_PLANTS_COUNT(count)}</span>
            </Link>
          );
        },
      },
      {
        key: "sort_order",
        header: LABELS.admin.CATEGORIES_COL_SORT_ORDER,
        align: "center",
        render: (row) => (
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-surface-100 text-surface-700 font-mono text-xs font-semibold">
            {row.sort_order ?? 0}
          </span>
        ),
      },
      {
        key: "status",
        header: LABELS.admin.CATEGORIES_COL_STATUS,
        align: "center",
        render: (row) => (
          <BadgeCommon variant={row.is_active ? "success" : "default"} size="sm">
            {row.is_active
              ? LABELS.admin.CATEGORIES_STATUS_ACTIVE
              : LABELS.admin.CATEGORIES_STATUS_INACTIVE}
          </BadgeCommon>
        ),
      },
      {
        key: "actions",
        header: LABELS.admin.CATEGORIES_COL_ACTIONS,
        align: "right",
        render: (row) => (
          <div className="flex items-center justify-end gap-1">
            <ButtonCommon
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs"
              title={LABELS.admin.CATEGORIES_ACTION_EDIT}
              onClick={() => handleOpenEditModal(row)}
            >
              <Pencil className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {LABELS.admin.CATEGORIES_ACTION_EDIT}
              </span>
            </ButtonCommon>

            <ButtonCommon
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700"
              title={LABELS.admin.CATEGORIES_ACTION_DELETE}
              onClick={() => setDeletingCategory(row)}
            >
              <Trash2 className="w-3.5 h-3.5" />
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
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-surface-900 font-serif">
              {LABELS.admin.CATEGORIES_MGMT_TITLE}
            </h1>
            <BadgeCommon variant="default" size="sm">
              {LABELS.admin.CATEGORIES_TOTAL(stats.total)}
            </BadgeCommon>
          </div>
          <p className="text-xs text-surface-500 mt-1">
            {LABELS.admin.CATEGORIES_MGMT_DESCRIPTION}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Nút liên kết chuyển nhanh sang Quản lý cây cảnh */}
          <Link to="/admin/plants">
            <ButtonCommon variant="outline" size="sm">
              <Leaf className="w-3.5 h-3.5 text-brand" />
              {LABELS.admin.CATEGORIES_ACTION_BACK_TO_PLANTS}
            </ButtonCommon>
          </Link>

          <ButtonCommon
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
            {LABELS.admin.CATEGORIES_ACTION_REFRESH}
          </ButtonCommon>

          <ButtonCommon
            variant="brand"
            size="sm"
            onClick={handleOpenAddModal}
          >
            <Plus className="w-3.5 h-3.5" />
            {LABELS.admin.CATEGORIES_ACTION_ADD}
          </ButtonCommon>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl border border-surface-200/80 bg-white shadow-2xs">
          <div className="flex items-center gap-2 text-surface-500 mb-1">
            <Layers className="w-4 h-4 text-brand" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {LABELS.admin.SIDEBAR_CATEGORIES}
            </span>
          </div>
          <p className="text-xl font-bold text-surface-900">{stats.total}</p>
        </div>

        <div className="p-3.5 rounded-xl border border-emerald-200/70 bg-emerald-50/40 shadow-2xs">
          <div className="flex items-center gap-2 text-emerald-700 mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {LABELS.admin.CATEGORIES_STATUS_ACTIVE}
            </span>
          </div>
          <p className="text-xl font-bold text-emerald-800">{stats.active}</p>
        </div>

        <div className="p-3.5 rounded-xl border border-surface-200/80 bg-surface-50/80 shadow-2xs">
          <div className="flex items-center gap-2 text-surface-600 mb-1">
            <XCircle className="w-4 h-4 text-surface-400" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {LABELS.admin.CATEGORIES_STATUS_INACTIVE}
            </span>
          </div>
          <p className="text-xl font-bold text-surface-700">{stats.inactive}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-white rounded-xl border border-surface-200 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-surface-400" />
          </div>
          <TextFieldCommon
            aria-label={LABELS.admin.CATEGORIES_SEARCH_LABEL}
            placeholder={LABELS.admin.CATEGORIES_SEARCH_PLACEHOLDER}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="w-full sm:w-44">
            <SelectCommon
              options={statusFilterOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-surface-200 shadow-2xs overflow-hidden">
        <TableCommon<AdminCategory>
          columns={columns}
          data={filteredCategories}
          rowKey="id"
          isLoading={isLoading}
          emptyTitle={LABELS.admin.CATEGORIES_EMPTY_TITLE}
          emptyDescription={LABELS.admin.CATEGORIES_EMPTY_DESC}
        />
      </div>

      {/* Modals */}
      <AdminCategoryFormModal
        open={isFormModalOpen}
        category={editingCategory}
        isLoading={isCreating || isUpdating}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleFormSubmit}
      />

      <AdminCategoryDeleteModal
        open={Boolean(deletingCategory)}
        category={deletingCategory}
        isLoading={isDeleting}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};
