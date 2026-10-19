import React from "react";
import { Sliders, ShieldAlert, BarChart3, Users, Trees, ShoppingCart } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";

export const AdminDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-surface-200">
        <h1 className="text-2xl font-bold tracking-tight text-surface-900">Bảng điều khiển quản trị</h1>
        <p className="text-xs text-surface-500 mt-1">Tổng quan hoạt động kinh doanh, kho tài sản cây và cấu hình hệ thống</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-surface-500">Tổng cây cảnh</p>
            <p className="text-xl font-bold text-surface-900 mt-1">128</p>
          </div>
          <div className="w-9 h-9 rounded bg-surface-100 text-surface-600 flex items-center justify-center">
            <Trees className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-surface-500">Đơn hàng mới</p>
            <p className="text-xl font-bold text-surface-900 mt-1">24</p>
          </div>
          <div className="w-9 h-9 rounded bg-surface-100 text-surface-600 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-surface-500">Hợp đồng thuê active</p>
            <p className="text-xl font-bold text-surface-900 mt-1">42</p>
          </div>
          <div className="w-9 h-9 rounded bg-surface-100 text-surface-600 flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-surface-500">Khách hàng</p>
            <p className="text-xl font-bold text-surface-900 mt-1">850</p>
          </div>
          <div className="w-9 h-9 rounded bg-surface-100 text-surface-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-surface-600" />
              <CardTitle className="text-sm">Tham số hệ thống (System Settings)</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-surface-500">
              Quản lý mức phí giao hàng mặc định, tỷ lệ quy đổi điểm loyalty, tiền phạt trễ hạn thuê cây...
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-surface-600" />
              <CardTitle className="text-sm">Nhật ký kiểm toán (Audit Logs)</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-surface-500">
              Theo dõi lịch sử thay đổi cấu hình, cập nhật kho số lượng và can thiệp trạng thái hợp đồng.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
