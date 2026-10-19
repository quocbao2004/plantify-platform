import React from "react";
import { ProductCard } from "./ProductCard";
import { EmptyState, LoadingOverlay } from "@/components/common";
import { Product } from "../types";

interface ProductGridProps {
  products?: Product[];
  isLoading: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading }) => {
  if (isLoading) {
    return <LoadingOverlay message="Đang tải danh sách cây cảnh..." className="min-h-[300px]" />;
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        title="Không tìm thấy cây cảnh phù hợp"
        description="Thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh lại các tiêu chí bộ lọc."
        className="min-h-[280px]"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
