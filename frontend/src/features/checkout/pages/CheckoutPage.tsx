import React from "react";
import { ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";

export const CheckoutPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-surface-200">
        <h1 className="text-2xl font-bold tracking-tight text-surface-900">Thanh toán đơn hàng</h1>
        <p className="text-xs text-surface-500 mt-1">Xác nhận thông tin giao nhận và lựa chọn phương thức thanh toán an toàn</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">1. Địa chỉ nhận hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-surface-500">Vui lòng chọn hoặc thêm địa chỉ giao hàng hợp lệ.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">2. Phương thức thanh toán</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-surface-500">Hỗ trợ cổng thanh toán VNPay, MoMo, ZaloPay và Tiền mặt khi nhận hàng (COD).</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Tóm tắt đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-xs text-surface-600">
                <span>Tạm tính</span>
                <span>0 ₫</span>
              </div>
              <div className="flex justify-between text-xs text-surface-600">
                <span>Phí vận chuyển</span>
                <span>0 ₫</span>
              </div>
              <div className="pt-3 border-t border-surface-100 flex justify-between font-bold text-sm text-surface-900">
                <span>Tổng thanh toán</span>
                <span className="text-accent-700">0 ₫</span>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center gap-2 text-xs text-surface-500 p-3 bg-surface-100/50 rounded border border-surface-200">
            <ShieldCheck className="w-4 h-4 text-accent-700 shrink-0" />
            <span>Giao dịch được mã hóa và bảo mật qua cổng thanh toán đối tác.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
