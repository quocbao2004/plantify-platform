import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { BadgeCommon } from "@/components/common/BadgeCommon";
import { AdminOrdersPage } from "@/features/admin/pages/AdminOrdersPage";
import { adminOrdersApi } from "@/features/admin/api/adminOrdersApi";
import { LABELS } from "@/constants/labels";

vi.mock("@/services/notifications", () => ({
  notify: { success: vi.fn(), error: vi.fn(), info: vi.fn(), dismiss: vi.fn() },
}));

vi.mock("lucide-react", () => ({
  ShoppingBag: () => null,
  Clock: () => null,
  PackageCheck: () => null,
  Truck: () => null,
  CheckCircle2: () => null,
  XCircle: () => null,
  Eye: () => null,
  Pencil: () => null,
  RefreshCw: () => null,
  Search: () => null,
  Filter: () => null,
  Package: () => null,
  Calendar: () => null,
  User: () => null,
  Phone: () => null,
  Mail: () => null,
  MapPin: () => null,
  FileText: () => null,
  CreditCard: () => null,
  Tag: () => null,
  AlertCircle: () => null,
  X: () => null,
}));

vi.mock("@/features/admin/api/adminOrdersApi", () => ({
  adminOrdersApi: {
    getOrders: vi.fn(),
    getOrderDetail: vi.fn(),
    updateOrderStatus: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(cleanup);

describe("BadgeCommon component", () => {
  it("renders with dot indicator and correct text", () => {
    render(
      <BadgeCommon variant="success" dot>
        {LABELS.admin.ORDERS_STATUS_COMPLETED}
      </BadgeCommon>
    );

    expect(screen.getByText(LABELS.admin.ORDERS_STATUS_COMPLETED)).toBeDefined();
  });

  it("renders different variants properly", () => {
    const { container } = render(
      <BadgeCommon variant="warning">
        {LABELS.admin.ORDERS_STATUS_PENDING}
      </BadgeCommon>
    );

    expect(container.textContent).toContain(LABELS.admin.ORDERS_STATUS_PENDING);
  });
});

describe("AdminOrdersPage component", () => {
  it("renders admin order management page header and stat elements", async () => {
    vi.mocked(adminOrdersApi.getOrders).mockResolvedValue({
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          id: "ord-1",
          order_code: "ORD-TEST-001",
          user: "user-1",
          user_email: "test@example.com",
          recipient_name: "Nguyễn Văn Test",
          recipient_phone: "0901234567",
          shipping_address: "123 Đường Cây Xanh, Q1, TP.HCM",
          status: "PENDING",
          status_display: "Chờ xử lý",
          total_amount: 550000,
          created_at: "2026-11-10T10:00:00Z",
          updated_at: "2026-11-10T10:00:00Z",
          details: [],
        },
      ],
    });

    render(
      <QueryProvider>
        <MemoryRouter>
          <AdminOrdersPage />
        </MemoryRouter>
      </QueryProvider>
    );

    // Expect page title from LABELS
    expect(
      screen.getByRole("heading", { name: LABELS.admin.ORDERS_MGMT_TITLE })
    ).toBeDefined();

    // Expect search input with placeholder from LABELS
    expect(
      screen.getByPlaceholderText(LABELS.admin.ORDERS_SEARCH_PLACEHOLDER)
    ).toBeDefined();

    // Expect refresh button from LABELS
    expect(
      screen.getByRole("button", { name: new RegExp(LABELS.admin.ORDERS_ACTION_REFRESH) })
    ).toBeDefined();
  });
});
