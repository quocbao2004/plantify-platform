import { CURRENCY } from "@/constants";

/**
 * Format số nguyên tiền đồng VND sang chuỗi hiển thị chuẩn (ví dụ: 120.000 ₫).
 */
export function formatCurrencyVND(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `0 ${CURRENCY.SYMBOL}`;
  }

  return new Intl.NumberFormat(CURRENCY.LOCALE, {
    style: "currency",
    currency: CURRENCY.CODE,
    maximumFractionDigits: 0,
  }).format(amount);
}
