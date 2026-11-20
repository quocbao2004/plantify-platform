import { CURRENCY } from "@/constants";

/**
 * Format so nguyen tien dong VND sang chuoi hien thi chuan (vi du: 120.000 d).
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

/**
 * Format chuoi hoac so voi dau cham phan cach hang nghin (vi du: "50000" -> "50.000"),
 * tu dong loai bo cac so 0 thua o dau (vi du: "050000" -> "50.000", "0" -> "0").
 */
export function formatNumberWithDots(val: string | number | null | undefined): string {
  if (val === null || val === undefined || val === "") return "";
  const str = String(val);
  const digits = str.replace(/\D/g, "");
  if (!digits) return "";
  const cleaned = digits.replace(/^0+(?=\d)/, "");
  return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Parse chuoi dinh dang co dau cham sang so nguyen.
 */
export function parseNumberFromDots(val: string | number | null | undefined): number {
  if (val === null || val === undefined || val === "") return 0;
  if (typeof val === "number") return isNaN(val) ? 0 : val;
  const digits = String(val).replace(/\D/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

