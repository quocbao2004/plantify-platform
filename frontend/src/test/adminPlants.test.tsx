import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { AdminPlantsPage } from "@/features/admin/pages/AdminPlantsPage";
import { adminPlantsApi } from "@/features/admin/api/adminPlantsApi";
import { LABELS } from "@/constants/labels";

vi.mock("@/services/notifications", () => ({
  notify: { success: vi.fn(), error: vi.fn(), info: vi.fn(), dismiss: vi.fn() },
}));

vi.mock("lucide-react", () => ({
  Leaf: () => null,
  Plus: () => null,
  RefreshCw: () => null,
  Search: () => null,
  Filter: () => null,
  Eye: () => null,
  Pencil: () => null,
  Trash2: () => null,
  CheckCircle2: () => null,
  XCircle: () => null,
  Layers: () => null,
  DollarSign: () => null,
  Tag: () => null,
  Calendar: () => null,
  BookOpen: () => null,
  Info: () => null,
  AlertTriangle: () => null,
  X: () => null,
}));

vi.mock("@/features/admin/api/adminPlantsApi", () => ({
  adminPlantsApi: {
    getPlants: vi.fn(),
    getPlantDetail: vi.fn(),
    createPlant: vi.fn(),
    updatePlant: vi.fn(),
    deletePlant: vi.fn(),
    getCategories: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(cleanup);

describe("AdminPlantsPage component", () => {
  it("renders admin plant management header, controls and table elements", async () => {
    vi.mocked(adminPlantsApi.getCategories).mockResolvedValue({
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          id: "cat-1",
          name: "Cây trong nhà",
          slug: "cay-trong-nha",
          is_active: true,
        },
      ],
    });

    vi.mocked(adminPlantsApi.getPlants).mockResolvedValue({
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          id: "plant-1",
          name: "Trầu Bà Đế Vương",
          slug: "trau-ba-de-vuong",
          category: "cat-1",
          category_name: "Cây trong nhà",
          description: "Cây cảnh phong thủy đẹp",
          care_guide: "Tưới nước 2 lần/tuần",
          is_active: true,
          sale_price: 350000,
          rental_price: 120000,
          created_at: "2026-11-10T10:00:00Z",
          updated_at: "2026-11-10T10:00:00Z",
          details: [
            {
              id: "detail-1",
              sku: "SKU-TBDV-01",
              size: "M",
              sale_price: 350000,
              rental_price: 120000,
              stock_quantity: 15,
              status: "AVAILABLE",
            },
          ],
        },
      ],
    });

    render(
      <QueryProvider>
        <MemoryRouter>
          <AdminPlantsPage />
        </MemoryRouter>
      </QueryProvider>
    );

    // Expect page title from LABELS
    expect(
      screen.getByRole("heading", { name: LABELS.admin.PLANTS_MGMT_TITLE })
    ).toBeDefined();

    // Expect Add Plant button
    expect(
      screen.getByRole("button", { name: new RegExp(LABELS.admin.PLANTS_ACTION_ADD) })
    ).toBeDefined();

    // Expect search input with placeholder from LABELS
    expect(
      screen.getByPlaceholderText(LABELS.admin.PLANTS_SEARCH_PLACEHOLDER)
    ).toBeDefined();

    // Expect refresh button from LABELS
    expect(
      screen.getByRole("button", { name: new RegExp(LABELS.admin.PLANTS_ACTION_REFRESH) })
    ).toBeDefined();
  });
});
