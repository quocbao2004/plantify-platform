export interface PaymentMethodOption {
  id: "VNPAY" | "MOMO" | "ZALOPAY" | "COD";
  name: string;
  description: string;
}

export const PAYMENT_METHODS: PaymentMethodOption[] = [
  { id: "VNPAY", name: "VNPay QR / Thẻ nội địa", description: "Quét mã QR qua ứng dụng ngân hàng" },
  { id: "MOMO", name: "Ví MoMo", description: "Thanh toán qua ví điện tử MoMo" },
  { id: "ZALOPAY", name: "Ví ZaloPay", description: "Thanh toán qua ví điện tử ZaloPay" },
  { id: "COD", name: "Thanh toán khi nhận hàng", description: "Trả tiền mặt cho shipper" },
];
