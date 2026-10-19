import React from "react";
import { Link } from "react-router-dom";
import { Trees, ArrowRight, ShieldCheck, RefreshCw, CalendarCheck } from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardContent } from "@/components/ui";

export const RentalListPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Introduction Banner */}
      <div className="pb-4 border-b border-surface-200">
        <h1 className="text-2xl font-bold tracking-tight text-surface-900">Dịch vụ cho thuê cây cảnh trọn gói</h1>
        <p className="text-xs text-surface-500 mt-1">
          Giải pháp không gian xanh linh hoạt cho văn phòng, căn hộ và sự kiện chuyên nghiệp
        </p>
      </div>

      {/* Value Proposition Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="w-8 h-8 rounded bg-accent-50 text-accent-700 flex items-center justify-center mb-2">
              <RefreshCw className="w-4 h-4" />
            </div>
            <CardTitle className="text-sm">Chăm sóc & Đổi cây định kỳ</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-surface-500">
              Kỹ thuật viên Plantify kiểm định sức khỏe cây 2 tuần/lần và thay cây mới miễn phí nếu cây yếu.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-8 h-8 rounded bg-accent-50 text-accent-700 flex items-center justify-center mb-2">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <CardTitle className="text-sm">Kỳ hạn thuê linh hoạt</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-surface-500">
              Tùy chọn thuê theo ngày cho sự kiện, theo tuần hoặc hợp đồng dài hạn theo tháng với chi phí tối ưu.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-8 h-8 rounded bg-accent-50 text-accent-700 flex items-center justify-center mb-2">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <CardTitle className="text-sm">Hoàn trả tiền cọc minh bạch</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-surface-500">
              Sổ quỹ cọc điện tử (Deposit Ledger) ghi nhận tự động và hoàn trả 100% qua tài khoản ngân hàng khi kết thúc hợp đồng.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CTA Box */}
      <div className="p-6 rounded-md bg-white border border-surface-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-surface-900">Bạn muốn thuê cây cảnh cho văn phòng hoặc nhà ở?</h3>
          <p className="text-xs text-surface-500 mt-0.5">Chọn mẫu cây bạn yêu thích trong danh mục và nhấn &ldquo;Thuê cây định kỳ&rdquo;.</p>
        </div>
        <Link to="/catalog">
          <Button variant="primary" size="sm">
            <Trees className="w-4 h-4" />
            Xem danh mục cây cho thuê
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
};
