import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Check, Sun, Droplets, ShieldCheck, Sprout } from "lucide-react";
import { useProductDetail } from "../hooks/useProductDetail";
import { Button, Badge, Card } from "@/components/ui";
import { LoadingOverlay } from "@/components/common";
import { formatCurrencyVND } from "@/utils";
import { CARE_LEVEL_LABELS, LIGHT_REQUIREMENT_LABELS } from "../constants";

export const ProductDetailPage: React.FC = () => {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const { data: product, isLoading, error } = useProductDetail(idOrSlug || "");

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  if (isLoading) {
    return <LoadingOverlay message="Đang tải thông tin chi tiết cây cảnh..." className="min-h-[400px]" />;
  }

  if (error || !product) {
    return (
      <div className="text-center py-12 space-y-4">
        <h2 className="text-lg font-semibold text-surface-900">Không tìm thấy sản phẩm</h2>
        <p className="text-xs text-surface-500">Cây cảnh bạn đang tìm kiếm không tồn tại hoặc đã ngừng kinh doanh.</p>
        <Link to="/catalog">
          <Button variant="outline" size="sm">
            Quay lại danh mục
          </Button>
        </Link>
      </div>
    );
  }

  const selectedVariant =
    product.variants?.find((v) => v.id === selectedVariantId) || product.variants?.[0];

  return (
    <div className="space-y-6">
      <Link
        to="/catalog"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-surface-500 hover:text-surface-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Quay lại danh mục cây cảnh
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-surface-100 rounded-md border border-surface-200 overflow-hidden relative">
            {product.primary_image ? (
              <img src={product.primary_image} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-surface-400">
                <Sprout className="w-16 h-16 stroke-[1.5]" />
                <span className="text-xs mt-2">Chưa có hình ảnh</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Details & Actions */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-surface-500">{product.category_name}</span>
              <Badge variant="outline">{CARE_LEVEL_LABELS[product.care_level]}</Badge>
            </div>
            <h1 className="text-2xl font-bold text-surface-900">{product.name}</h1>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-md bg-surface-100/60 border border-surface-200 space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-surface-500">Giá mua sở hữu:</span>
              <span className="text-2xl font-bold text-accent-700">
                {selectedVariant?.sale_price_vnd ? formatCurrencyVND(selectedVariant.sale_price_vnd) : "Liên hệ"}
              </span>
            </div>
            {selectedVariant?.deposit_vnd ? (
              <div className="text-xs text-surface-600">
                <span>Tiền cọc thuê: </span>
                <span className="font-semibold">{formatCurrencyVND(selectedVariant.deposit_vnd)}</span>
              </div>
            ) : null}
          </div>

          {/* Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-medium text-surface-700">Chọn kích thước:</label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <Button
                    key={v.id}
                    type="button"
                    variant={selectedVariant?.id === v.id ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setSelectedVariantId(v.id)}
                  >
                    {v.size_display} {v.height_cm ? `(${v.height_cm}cm)` : ""}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Care Attributes */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Card className="p-3 flex items-center gap-2.5">
              <Sun className="w-4 h-4 text-amber-500 shrink-0" />
              <div className="text-xs">
                <p className="text-surface-500">Ánh sáng</p>
                <p className="font-medium">{LIGHT_REQUIREMENT_LABELS[product.light_requirement]}</p>
              </div>
            </Card>
            <Card className="p-3 flex items-center gap-2.5">
              <Droplets className="w-4 h-4 text-blue-500 shrink-0" />
              <div className="text-xs">
                <p className="text-surface-500">Chăm sóc</p>
                <p className="font-medium">{CARE_LEVEL_LABELS[product.care_level]}</p>
              </div>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-surface-200">
            <Button variant="primary" size="lg" className="flex-1">
              <Check className="w-4 h-4" />
              Mua ngay
            </Button>
            <Button variant="outline" size="lg" className="flex-1">
              <ShieldCheck className="w-4 h-4" />
              Thuê cây định kỳ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
