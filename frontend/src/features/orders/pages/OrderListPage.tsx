import React from "react";
import { Link } from "react-router-dom";
import { ClipboardList, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import { EmptyState } from "@/components/common";

export const OrderListPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-surface-200">
        <h1 className="text-2xl font-bold tracking-tight text-surface-900">Lịch sử đơn hàng</h1>
        <p className="text-xs text-surface-500 mt-1">Theo dõi tiến trình xử lý và tình trạng vận chuyển các đơn đặt mua cây</p>
      </div>

      <EmptyState
        icon={<ClipboardList className="w-6 h-6 text-surface-400" />}
        title="Chưa có đơn hàng nào"
        description="Khi bạn đặt mua cây cảnh tại Plantify, thông tin đơn hàng sẽ xuất hiện tại đây."
        action={
          <Link to="/catalog">
            <Button variant="primary" size="sm">
              Mua sắm ngay
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        }
      />
    </div>
  );
};
