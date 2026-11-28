export interface CartItem {
  plant_detail: string;
  quantity: number;
}

export interface CartQuoteLine extends CartItem {
  name: string | null;
  slug: string | null;
  size: string;
  unit_price: string | null;
  line_total: string;
  available_quantity: number;
}

export interface CartQuote {
  items: CartQuoteLine[];
  subtotal: string;
  shipping_fee: string;
  total: string;
  vnpay_enabled: boolean;
}
