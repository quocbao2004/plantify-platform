import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { AdminReturnsPage } from "@/features/admin/pages/AdminReturnsPage";
import { adminReturnsApi } from "@/features/admin/api/adminReturnsApi";
import { LABELS } from "@/constants/labels";

vi.mock("@/services/notifications", () => ({
  notify: { success: vi.fn(), error: vi.fn(), info: vi.fn(), dismiss: vi.fn() },
}));

vi.mock("lucide-react", () => ({
  RotateCcw: () => null,
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
  Leaf: () => null,
  AlertTriangle: () => null,
  Calendar: () => null,
  User: () => null,
  Phone: () => null,
  Mail: () => null,
  FileText: () => null,
  DollarSign: () => null,
  ShoppingBag: () => null,
  Image: () => null,
  AlertCircle: () => null,
  X: () => null,
}));

vi.mock("@/features/admin/api/adminReturnsApi", () => ({
  adminReturnsApi: {
    getReturns: vi.fn(),
    getReturnDetail: vi.fn(),
    updateReturn: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(cleanup);

describe("AdminReturnsPage component", () => {
  it("renders page header, statistics, and table with mock return request", async () => {
    vi.mocked(adminReturnsApi.getReturns).mockResolvedValue({
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          id: "ret-1",
          return_code: "RET-TEST-001",
          order: "ord-1",
          order_code: "ORD-12345",
          user: "user-1",
          user_name: "Nguyễn Văn Test",
          user_email: "test@example.com",
          user_phone: "0901234567",
          plant_name: "Cây Kim Tiền",
          plant_sku: "KT-001",
          plant_size: "M",
          request_type: "EXCHANGE",
          request_type_display: "Đổi cây mới",
          reason: "DAMAGED_TRANSIT",
          reason_display: "Gãy cành do vận chuyển",
          status: "PENDING",
          status_display: "Chờ xét duyệt",
          quantity: 1,
          refund_amount: 0,
          customer_notes: "Cây bị gãy 2 cành khi nhận",
          created_at: "2026-11-12T10:00:00Z",
          updated_at: "2026-11-12T10:00:00Z",
        },
      ],
    });

    render(
      <MemoryRouter>
        <QueryProvider>
          <AdminReturnsPage />
        </QueryProvider>
      </MemoryRouter>
    );

    // Verify Title
    expect(
      screen.getByText(LABELS.admin.RETURNS_MGMT_TITLE)
    ).toBeDefined();

    // Wait for data row
    const codeElement = await screen.findByText("RET-TEST-001");
    expect(codeElement).toBeDefined();

    // Verify Plant name
    expect(screen.getByText("Cây Kim Tiền")).toBeDefined();

    // Verify Order code
    expect(screen.getByText("ORD-12345")).toBeDefined();
  });
});
