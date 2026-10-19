import React from "react";
import { Link } from "react-router-dom";
import { Sprout, ShieldCheck, RefreshCw, Truck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import { ProductGrid } from "../components/ProductGrid";
import { useProducts } from "../hooks/useProducts";

export const HomePage: React.FC = () => {
  const { data: featuredData, isLoading } = useProducts({ page_size: 4 });

  return (
    <div className="space-y-16 py-6">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-50 text-accent-800 border border-accent-200 text-xs font-medium">
          <Sprout className="w-3.5 h-3.5" />
          <span>Nền tảng mua sắm & cho thuê cây cảnh thông minh</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-surface-900 leading-tight">
          Mang thiên nhiên tươi mát vào không gian sống của bạn
        </h1>

        <p className="text-base text-surface-600 max-w-2xl mx-auto">
          Plantify cung cấp hệ sinh thái cây cảnh cao cấp, từ mua sở hữu đến dịch vụ cho thuê trọn gói
          kèm kỹ thuật viên bảo dưỡng định kỳ tận nơi.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link to="/catalog">
            <Button variant="primary" size="lg" className="font-semibold gap-2">
              Khám phá danh mục cây
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/rentals">
            <Button variant="outline" size="lg" className="font-semibold">
              Dịch vụ thuê cây văn phòng
            </Button>
          </Link>
        </div>
      </section>

      {/* Trust & Guarantee Badges */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-y border-surface-200 py-8">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded bg-accent-50 text-accent-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-surface-900">Bảo đảm sống 100%</h4>
            <p className="text-xs text-surface-500 mt-0.5">Cam kết 1 đổi 1 trong vòng 30 ngày nếu cây gặp vấn đề sinh trưởng.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded bg-accent-50 text-accent-700 flex items-center justify-center shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-surface-900">Bảo dưỡng định kỳ</h4>
            <p className="text-xs text-surface-500 mt-0.5">Đội ngũ kỹ thuật viên chăm sóc, cắt tỉa và bón phân chuyên nghiệp.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded bg-accent-50 text-accent-700 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-surface-900">Vận chuyển an toàn</h4>
            <p className="text-xs text-surface-500 mt-0.5">Đóng gói quy chuẩn chống gãy cành, dập lá, giao tận phòng khách.</p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-surface-900">Cây cảnh nổi bật</h2>
            <p className="text-xs text-surface-500 mt-0.5">Những giống cây nội thất được yêu thích nhất trong tuần</p>
          </div>
          <Link to="/catalog">
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              Xem tất cả
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        <ProductGrid products={featuredData?.results} isLoading={isLoading} />
      </section>
    </div>
  );
};
