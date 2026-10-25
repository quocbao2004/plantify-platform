import { BaseEntity } from "@/types";

export type OrderStatus = "PENDING" | "PAID" | "CONFIRMED" | "SHIPPED" | "COMPLETED" | "CANCELLED";

export interface OrderItem extends BaseEntity {
  variant_sku: string;
  product_name: string;
  quantity: number;
  unit_price_vnd: number;
  total_price_vnd: number;
}

export interface Order extends BaseEntity {
  order_number: string;
  status: OrderStatus;
  status_display: string;
  subtotal_vnd: number;
  shipping_fee_vnd: number;
  discount_amount_vnd: number;
  total_amount_vnd: number;
  items: OrderItem[];
  created_at: string;
}
