/** Mock data cho Admin Dashboard — thay bằng API calls khi backend sẵn sàng */

export type OrderStatus = "pending" | "delivering" | "done" | "cancelled";
export type ConsultStatus = "not_called" | "supported";

export interface DashboardStats {
  revenue: number;
  revenueTrendPct: number;
  totalOrders: number;
  pendingOrders: number;
  totalInventory: number;
  inventoryIndoor: number;
  inventoryDesktop: number;
  inventoryAccessory: number;
  newConsults: number;
}

export interface OrderRow {
  id: string;
  customerName: string;
  productName: string;
  productImage: string;
  specialNote: string;
  status: OrderStatus;
  total: number | null;
}

export interface ConsultRow {
  id: string;
  initials: string;
  customerName: string;
  phone: string;
  topic: string;
  note: string;
  status: ConsultStatus;
}

// ─── Mock values ───────────────────────────────────────────────────────────

export const DASHBOARD_STATS: DashboardStats = {
  revenue: 128_500_000,
  revenueTrendPct: 12,
  totalOrders: 142,
  pendingOrders: 12,
  totalInventory: 320,
  inventoryIndoor: 150,
  inventoryDesktop: 110,
  inventoryAccessory: 60,
  newConsults: 8,
};

export const MOCK_ORDERS: OrderRow[] = [
  {
    id: "#KB1024",
    customerName: "Nguyễn Văn A",
    productName: "Trầu bà lá xẻ (Monstera)",
    productImage: "/images/plants/monstera.webp",
    specialNote: "Giao buổi sáng, bọc quà",
    status: "pending",
    total: null,
  },
  {
    id: "#KB1025",
    customerName: "Trần Thị B",
    productName: "Cây Kim Tiền (Chậu Si)",
    productImage: "/images/plants/kim-tien.webp",
    specialNote: "Không",
    status: "delivering",
    total: null,
  },
];

export const MOCK_CONSULTS: ConsultRow[] = [
  {
    id: "c-001",
    initials: "LM",
    customerName: "Lê Minh",
    phone: "SDT: 096***xxx",
    topic: "Tư vấn cây cảnh",
    note: "Cây hợp phong thuỷ mệnh Mộc",
    status: "not_called",
  },
  {
    id: "c-002",
    initials: "PH",
    customerName: "Phạm Hương",
    phone: "SDT: 0982***xxx",
    topic: "Tư vấn cây cảnh",
    note: "Cây để bàn ít cần ánh sáng",
    status: "supported",
  },
];
