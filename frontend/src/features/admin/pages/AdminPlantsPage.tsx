import React, { useState, useMemo } from "react";
import {
  Leaf,
  Plus,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  Layers,
} from "lucide-react";
import { LABELS } from "@/constants/labels";
import { ButtonCommon } from "@/components/common/ButtonCommon";
import { TextFieldCommon } from "@/components/common/TextFieldCommon";
import { SelectCommon, type SelectOption } from "@/components/common/SelectCommon";
import { TableCommon, type TableColumn } from "@/components/common/TableCommon";
import { BadgeCommon } from "@/components/common/BadgeCommon";
import { formatCurrencyVND } from "@/utils/formatCurrency";
import {
  useAdminPlants,
  useAdminCategories,
  useCreateAdminPlant,
  useUpdateAdminPlant,
  useDeleteAdminPlant,
} from "../hooks/useAdminPlants";
import { AdminPlant, CreateAdminPlantPayload } from "../types";
import {
  ADMIN_PLANT_STATUS_CONFIG,
  ADMIN_PLANT_STATUS_FILTER_OPTIONS,
  ADMIN_PLANT_TABS,
} from "../constants/plants";
import { AdminPlantFormModal } from "../components/AdminPlantFormModal";
import { AdminPlantDetailModal } from "../components/AdminPlantDetailModal";
import { AdminPlantDeleteModal } from "../components/AdminPlantDeleteModal";

export const AdminPlantsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<string>("ALL");

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState<AdminPlant | null>(null);
  const [viewingPlant, setViewingPlant] = useState<AdminPlant | null>(null);
  const [deletingPlant, setDeletingPlant] = useState<AdminPlant | null>(null);

  // Determine effective is_active query param
  const effectiveIsActive =
    activeTab === "ACTIVE"
      ? "true"
      : activeTab === "INACTIVE"
      ? "false"
      : statusFilter === "ACTIVE"
      ? "true"
      : statusFilter === "INACTIVE"
      ? "false"
      : "all";

  // Data fetching
  const { data, isLoading, isFetching, refetch } = useAdminPlants({
    search: searchTerm.trim() || undefined,
    category: categoryFilter !== "ALL" ? categoryFilter : undefined,
    is_active: effectiveIsActive,
  });

  const { data: categoriesData } = useAdminCategories();
  const categories = categoriesData?.results ?? [];

  const { mutate: createPlant, isPending: isCreating } = useCreateAdminPlant();
  const { mutate: updatePlant, isPending: isUpdating } = useUpdateAdminPlant();
  const { mutate: deletePlant, isPending: isDeleting } = useDeleteAdminPlant();

  const plants = useMemo(() => data?.results ?? [], [data?.results]);
  const totalCount = data?.count ?? plants.length;

  // Quick stats
  const stats = useMemo(() => {
    let active = 0;
    let inactive = 0;
    plants.forEach((p) => {
      if (p.is_active) active++;
      else inactive++;
    });
    return {
      total: totalCount,
      active,
      inactive,
      categoriesCount: categories.length,
    };
  }, [plants, totalCount, categories.length]);

  const categoryFilterOptions: SelectOption[] = useMemo(() => {
    return [
      { value: "ALL", label: LABELS.admin.PLANTS_FILTER_ALL_CATEGORIES },
      ...categories.map((c) => ({ value: c.id, label: c.name })),
    ];
  }, [categories]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setStatusFilter(key);
  };

  const handleStatusFilterChange = (val: string) => {
    setStatusFilter(val);
    setActiveTab(val);
  };

  const handleOpenAddModal = () => {
    setEditingPlant(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (plant: AdminPlant) => {
    setEditingPlant(plant);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (payload: CreateAdminPlantPayload) => {
    if (editingPlant) {
      updatePlant(
        { id: editingPlant.id, payload },
        {
          onSuccess: () => {
            setIsFormModalOpen(false);
            setEditingPlant(null);
          },
        }
      );
    } else {
      createPlant(payload, {
        onSuccess: () => {
          setIsFormModalOpen(false);
        },
      });
    }
  };

  const handleDeleteConfirm = (plant: AdminPlant) => {
    deletePlant(plant.id, {
      onSuccess: () => {
        setDeletingPlant(null);
      },
    });
  };

  // Table columns definition
  const columns: TableColumn<AdminPlant>[] = useMemo(
    () => [
      {
        key: "name",
        header: LABELS.admin.PLANTS_COL_NAME,
        render: (row) => (
          <div className="flex items-center gap-3">
            {row.primary_image ? (
              <img
                src={row.primary_image}
                alt={row.name}
                className="w-10 h-10 rounded-lg object-cover border border-surface-200 shrink-0 bg-surface-50"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-brand/10 text-brand flex items-center justify-center shrink-0 border border-brand/20">
                <Leaf className="w-5 h-5" />
              </div>
            )}
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
        key: "category",
        header: LABELS.admin.PLANTS_COL_CATEGORY,
        render: (row) => (
          <span className="text-xs font-medium text-surface-700">
            {row.category_name || LABELS.admin.STATUS_UNAVAILABLE}
          </span>
        ),
      },
      {
        key: "price",
        header: LABELS.admin.PLANTS_COL_PRICE,
        align: "right",
        render: (row) => (
          <span className="font-bold text-brand-dark font-serif text-xs">
            {formatCurrencyVND(row.sale_price ?? 0)}
          </span>
        ),
      },
      {
        key: "variants",
        header: LABELS.admin.PLANTS_COL_VARIANTS,
        align: "center",
        render: (row) => (
          <span className="text-xs font-medium text-surface-600 bg-surface-100 px-2.5 py-1 rounded-full">
            {LABELS.admin.PLANTS_VARIANTS_COUNT(row.details?.length ?? 0)}
          </span>
        ),
      },
      {
        key: "status",
        header: LABELS.admin.PLANTS_COL_STATUS,
        align: "center",
        render: (row) => {
          const config = row.is_active
            ? ADMIN_PLANT_STATUS_CONFIG.ACTIVE
            : ADMIN_PLANT_STATUS_CONFIG.INACTIVE;
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
        header: LABELS.admin.PLANTS_COL_ACTIONS,
        align: "right",
        render: (row) => (
          <div className="flex items-center justify-end gap-1.5">
            <ButtonCommon
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs"
              title={LABELS.admin.PLANTS_ACTION_VIEW}
              onClick={() => setViewingPlant(row)}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {LABELS.admin.PLANTS_ACTION_VIEW}
              </span>
            </ButtonCommon>

            <ButtonCommon
              variant="secondary"
              size="sm"
              className="h-7 px-2 text-xs"
              title={LABELS.admin.PLANTS_ACTION_EDIT}
              onClick={() => handleOpenEditModal(row)}
            >
              <Pencil className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {LABELS.admin.PLANTS_ACTION_EDIT}
              </span>
            </ButtonCommon>

            <ButtonCommon
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700"
              title={LABELS.admin.PLANTS_ACTION_DELETE}
              onClick={() => setDeletingPlant(row)}
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
          <h1 className="text-2xl font-bold tracking-tight text-surface-900 font-serif">
            {LABELS.admin.PLANTS_MGMT_TITLE}
          </h1>
          <p className="text-xs text-surface-500 mt-1">
            {LABELS.admin.PLANTS_MGMT_DESCRIPTION}
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
            {LABELS.admin.PLANTS_ACTION_REFRESH}
          </ButtonCommon>

          <ButtonCommon
            variant="brand"
            size="sm"
            onClick={handleOpenAddModal}
          >
            <Plus className="w-3.5 h-3.5" />
            {LABELS.admin.PLANTS_ACTION_ADD}
          </ButtonCommon>
        </div>
      </div>

      {/* Quick Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-surface-200/80 bg-white shadow-2xs">
          <div className="flex items-center gap-2 text-surface-500 mb-1">
            <Leaf className="w-4 h-4 text-brand" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {LABELS.admin.PLANTS_TAB_ALL}
            </span>
          </div>
          <p className="text-xl font-bold text-surface-900">{stats.total}</p>
        </div>

        <div className="p-3.5 rounded-xl border border-emerald-200/70 bg-emerald-50/40 shadow-2xs">
          <div className="flex items-center gap-2 text-emerald-700 mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {LABELS.admin.PLANTS_STATUS_ACTIVE}
            </span>
          </div>
          <p className="text-xl font-bold text-emerald-800">{stats.active}</p>
        </div>

        <div className="p-3.5 rounded-xl border border-surface-200/80 bg-surface-50/80 shadow-2xs">
          <div className="flex items-center gap-2 text-surface-600 mb-1">
            <XCircle className="w-4 h-4 text-surface-400" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {LABELS.admin.PLANTS_STATUS_INACTIVE}
            </span>
          </div>
          <p className="text-xl font-bold text-surface-700">{stats.inactive}</p>
        </div>

        <div className="p-3.5 rounded-xl border border-blue-200/70 bg-blue-50/40 shadow-2xs">
          <div className="flex items-center gap-2 text-blue-700 mb-1">
            <Layers className="w-4 h-4" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {LABELS.admin.PLANTS_FILTER_CATEGORY}
            </span>
          </div>
          <p className="text-xl font-bold text-blue-800">{stats.categoriesCount}</p>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-surface-200 overflow-x-auto pb-px">
          {ADMIN_PLANT_TABS.map((tab) => {
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

        {/* Search Bar & Dropdowns Filter */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-surface-400">
              <Search className="w-4 h-4" />
            </div>
            <TextFieldCommon
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={LABELS.admin.PLANTS_SEARCH_PLACEHOLDER}
              className="pl-9 h-9 text-xs"
              aria-label={LABELS.admin.PLANTS_SEARCH_LABEL}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Category Filter */}
            <div className="flex items-center gap-1.5 text-xs text-surface-500">
              <Filter className="w-3.5 h-3.5" />
              <span>{LABELS.admin.PLANTS_FILTER_CATEGORY}:</span>
            </div>
            <div className="w-44">
              <SelectCommon
                options={categoryFilterOptions}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            {/* Status Filter */}
            <div className="w-40">
              <SelectCommon
                options={ADMIN_PLANT_STATUS_FILTER_OPTIONS}
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Plants Table */}
      <div className="bg-white rounded-xl border border-surface-200 shadow-2xs overflow-hidden">
        <TableCommon
          columns={columns}
          data={plants}
          rowKey="id"
          isLoading={isLoading}
          emptyTitle={LABELS.admin.PLANTS_EMPTY_TITLE}
          emptyDescription={LABELS.admin.PLANTS_EMPTY_DESC}
          onRowClick={(row) => setViewingPlant(row)}
        />
      </div>

      {/* Plant Add/Edit Modal */}
      <AdminPlantFormModal
        plant={editingPlant}
        categories={categories}
        open={isFormModalOpen}
        isLoading={isCreating || isUpdating}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingPlant(null);
        }}
        onSubmit={handleFormSubmit}
      />

      {/* Plant Detail View Modal */}
      <AdminPlantDetailModal
        plant={viewingPlant}
        open={Boolean(viewingPlant)}
        onClose={() => setViewingPlant(null)}
        onEdit={(plant) => {
          setViewingPlant(null);
          handleOpenEditModal(plant);
        }}
      />

      {/* Plant Delete Confirm Modal */}
      <AdminPlantDeleteModal
        plant={deletingPlant}
        open={Boolean(deletingPlant)}
        isLoading={isDeleting}
        onClose={() => setDeletingPlant(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};
