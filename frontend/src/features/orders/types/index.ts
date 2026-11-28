import { BaseEntity } from "@/types";

export type OrderStatus = "PENDING" | "PAID" | "PROCESSING" | "DELIVERING" | "COMPLETED" | "CANCELLED";

export interface OrderItem extends BaseEntity {
  plant_name: string;
  plant_detail_info: { size: string };
  quantity: number;
  unit_price: string;
  total_price: string;
}

export interface Order extends BaseEntity {
  order_code: string;
  status: OrderStatus;
  shipping_fee: string;
  total_amount: string;
  recipient_name: string;
  recipient_phone: string;
  shipping_address: string;
  notes: string;
  details: OrderItem[];
  payment?: {
    method: string;
    status: "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";
    can_resume: boolean;
    expired: boolean;
  } | null;
  payment_url?: string;
}
