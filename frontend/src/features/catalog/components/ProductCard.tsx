import React from "react";
import { Link } from "react-router-dom";
import { Sprout } from "lucide-react";
import { Card, Badge } from "@/components/ui";
import { formatCurrencyVND } from "@/utils";
import { Product } from "../types";
import { CARE_LEVEL_LABELS } from "../constants";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card className="overflow-hidden hover:border-surface-400 transition-colors group flex flex-col h-full">
      <Link to={`/catalog/${product.slug || product.id}`} className="block relative aspect-square bg-surface-100 overflow-hidden">
        {product.primary_image ? (
          <img
            src={product.primary_image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-surface-400">
            <Sprout className="w-12 h-12 stroke-[1.5]" />
            <span className="text-xs mt-2">Hình ảnh đang cập nhật</span>
          </div>
        )}
      </Link>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-surface-500 mb-1">
            <span>{product.category_name}</span>
            <Badge variant="outline" className="text-[10px] py-0 px-1.5">
              {CARE_LEVEL_LABELS[product.care_level] || product.care_level}
            </Badge>
          </div>

          <Link
            to={`/catalog/${product.slug || product.id}`}
            className="text-sm font-semibold text-surface-900 line-clamp-1 hover:text-accent-700 transition-colors"
          >
            {product.name}
          </Link>
        </div>

        <div className="pt-2 border-t border-surface-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-surface-500 block">Giá từ</span>
            <span className="text-sm font-bold text-accent-700">
              {product.min_sale_price_vnd ? formatCurrencyVND(product.min_sale_price_vnd) : "Liên hệ"}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
