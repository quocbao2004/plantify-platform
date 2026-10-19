import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import { EmptyState } from "@/components/common";

export const CartPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-surface-200">
        <h1 className="text-2xl font-bold tracking-tight text-surface-900">Giỏ hàng của bạn</h1>
        <p className="text-xs text-surface-500 mt-1">Xem lại cây cảnh và dịch vụ bạn đã chọn trước khi thanh toán</p>
      </div>

      <EmptyState
        icon={<ShoppingBag className="w-6 h-6 text-surface-400" />}
        title="Giỏ hàng hiện đang trống"
        description="Hãy khám phá các mẫu cây cảnh nội thất và cây văn phòng để thêm vào giỏ."
        action={
          <Link to="/catalog">
            <Button variant="primary" size="sm">
              Khám phá cây cảnh ngay
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        }
      />
    </div>
  );
};
