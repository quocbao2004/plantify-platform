import { describe, it, expect } from "vitest";
import { formatCurrencyVND } from "@/utils/formatCurrency";

describe("formatCurrencyVND", () => {
  it("định dạng số tiền VNĐ chuẩn", () => {
    const formatted = formatCurrencyVND(150000);
    // Locale vi-VN định dạng chuẩn "150.000 ₫" hoặc có non-breaking space
    expect(formatted).toContain("150.000");
    expect(formatted).toContain("₫");
  });

  it("xử lý an toàn khi đầu vào là null hoặc undefined", () => {
    expect(formatCurrencyVND(null)).toContain("0");
    expect(formatCurrencyVND(undefined)).toContain("0");
  });
});
