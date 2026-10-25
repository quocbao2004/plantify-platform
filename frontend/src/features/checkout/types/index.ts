export interface CheckoutPayload {
  address_id: string;
  payment_method: "VNPAY" | "MOMO" | "ZALOPAY" | "COD";
  voucher_code?: string;
  note?: string;
}

export interface CheckoutResult {
  order_id: string;
  order_number: string;
  payment_url?: string;
}
