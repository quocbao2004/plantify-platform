import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { AdminShippingPage } from "@/features/admin/pages/AdminShippingPage";
import { adminShippingApi } from "@/features/admin/api/adminShippingApi";
import { LABELS } from "@/constants/labels";

vi.mock("@/services/notifications", () => ({
  notify: { success: vi.fn(), error: vi.fn(), info: vi.fn(), dismiss: vi.fn() },
}));

vi.mock("lucide-react", () => ({
  Truck: () => null,
  Clock: () => null,
  Package: () => null,
  CheckCircle2: () => null,
  AlertTriangle: () => null,
  Eye: () => null,
  UserCheck: () => null,
  RefreshCw: () => null,
  Search: () => null,
  Calendar: () => null,
  Phone: () => null,
  MapPin: () => null,
  FileText: () => null,
  DollarSign: () => null,
  Image: () => null,
  X: () => null,
}));

vi.mock("@/features/admin/api/adminShippingApi", () => ({
  adminShippingApi: {
    getShipments: vi.fn(),
    getShipmentDetail: vi.fn(),
    updateShipment: vi.fn(),
    getShippers: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(cleanup);

describe("AdminShippingPage component", () => {
  it("renders shipping management page header, stats, and shipment record", async () => {
    vi.mocked(adminShippingApi.getShipments).mockResolvedValue({
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          id: "ship-1",
          tracking_code: "SHIP-TEST-001",
          order: "ord-1",
          order_code: "PL-ORD-12345",
          order_total: 650000,
          shipper: "shipper-1",
          shipper_name: "Trần Văn Shipper",
          shipper_phone: "0912345678",
          status: "DELIVERING",
          status_display: "Đang giao hàng",
          recipient_name: "Lê Thị Khách",
          recipient_phone: "0987654321",
          shipping_address: "456 Đường Hoa Lan, Q.Phú Nhuận",
          cod_amount: 650000,
          cod_collected: 0,
          proof_image: "",
          created_at: "2026-11-28T10:00:00Z",
          updated_at: "2026-11-28T10:00:00Z",
        },
      ],
    });

    vi.mocked(adminShippingApi.getShippers).mockResolvedValue([
      {
        id: "shipper-1",
        full_name: "Trần Văn Shipper",
        email: "shipper@example.com",
        phone: "0912345678",
        role: "DELIVERY",
      },
    ]);

    render(
      <MemoryRouter>
        <QueryProvider>
          <AdminShippingPage />
        </QueryProvider>
      </MemoryRouter>
    );

    // Verify Title
    expect(screen.getByText(LABELS.admin.SHIPPING_MGMT_TITLE)).toBeDefined();

    // Wait for Tracking code
    const trackingCode = await screen.findByText("SHIP-TEST-001");
    expect(trackingCode).toBeDefined();

    // Verify Order code
    expect(screen.getByText("PL-ORD-12345")).toBeDefined();

    // Verify Shipper name
    expect(screen.getAllByText("Trần Văn Shipper").length).toBeGreaterThan(0);
  });
});
