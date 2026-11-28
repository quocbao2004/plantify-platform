import type { CartItem } from "@/features/cart/types";

export interface DeliveryDetails {
  recipient_name: string;
  recipient_phone: string;
  shipping_address: string;
  notes: string;
}

export interface CheckoutPayload extends DeliveryDetails {
  checkout_key: string;
  payment_method: "CASH" | "VNPAY";
  shipping_fee: string;
  items: (CartItem & { unit_price: string })[];
}
