import { BaseEntity } from "@/types";
import { ProductVariant } from "@/features/catalog/types";

export interface CartItem extends BaseEntity {
  variant: string;
  variant_details?: ProductVariant;
  quantity: number;
  item_type: "PURCHASE" | "RENTAL";
  rental_duration_months?: number;
}

export interface Cart extends BaseEntity {
  items: CartItem[];
  total_items: number;
  estimated_total_vnd: number;
}
