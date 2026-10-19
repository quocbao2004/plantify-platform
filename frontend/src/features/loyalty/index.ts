import { BaseEntity } from "@/types";

export interface LoyaltyTier extends BaseEntity {
  name: string;
  min_points: number;
  discount_percent: number;
}

export interface Voucher extends BaseEntity {
  code: string;
  title: string;
  discount_amount_vnd: number;
  min_order_vnd: number;
  expires_at: string;
}
