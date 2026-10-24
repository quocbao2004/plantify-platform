import { MESSAGES } from "@/constants/messages";
import { notify } from "@/services/notifications";
import { ButtonCommon } from "@/components/common/ButtonCommon";
import { LinkCommon } from "@/components/common/LinkCommon";
import { LABELS, PRODUCT_LABELS } from "@/constants/labels";

import { Heart, Plus, Sprout, ArrowUpRight } from "lucide-react";
import { formatCurrencyVND } from "@/utils";
import { useWishlistStore } from "@/stores/wishlistStore";
import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  badge?: string;
}

export function ProductCard({ product, onQuickView, badge }: ProductCardProps) {
  const favorite = useWishlistStore((state) =>
    state.productIds.includes(product.id),
  );
  const toggleFavorite = useWishlistStore((state) => state.toggle);
  const detailPath = `/catalog/${product.slug || product.id}`;
  const imageContent = product.primary_image ? (
    <img
      src={product.primary_image}
      alt={product.name}
      loading="lazy"
      width={600}
      height={600}
    />
  ) : (
    <div className="product-image-empty">
      <Sprout size={48} strokeWidth={1} />
      <span>{LABELS.common.IMAGE_PENDING}</span>
    </div>
  );

  return (
    <article className="plant-product-card">
      <div className="product-image-wrap">
        {onQuickView ? (
          <ButtonCommon
            variant="unstyled"
            type="button"
            className="product-image-link"
            onClick={() => onQuickView(product)}
            aria-label={PRODUCT_LABELS.quickView(product.name)}
          >
            {imageContent}
          </ButtonCommon>
        ) : (
          <LinkCommon to={detailPath} className="product-image-link">
            {imageContent}
          </LinkCommon>
        )}
        <span className="product-badge">
          {badge ||
            (product.care_level === "EASY"
              ? LABELS.catalog.EASY_BADGE
              : LABELS.catalog.BESTSELLER)}
        </span>
        <ButtonCommon
          variant="unstyled"
          type="button"
          className={`favorite-button${favorite ? " is-favorite" : ""}`}
          onClick={() => {
            toggleFavorite(product.id);
            notify.success(
              favorite
                ? MESSAGES.FAVORITE_REMOVED(product.name)
                : MESSAGES.FAVORITE_ADDED(product.name),
              { id: `wishlist-${product.id}` },
            );
          }}
          aria-label={PRODUCT_LABELS.favorite(product.name, favorite)}
          aria-pressed={favorite}
        >
          <Heart
            size={17}
            strokeWidth={1.4}
            fill={favorite ? "currentColor" : "none"}
          />
        </ButtonCommon>
      </div>
      <div className="product-copy">
        {onQuickView ? (
          <ButtonCommon
            variant="unstyled"
            type="button"
            className="product-name"
            onClick={() => onQuickView(product)}
          >
            {product.name}
          </ButtonCommon>
        ) : (
          <LinkCommon to={detailPath} className="product-name">
            {product.name}
          </LinkCommon>
        )}
        <p className="product-description">
          {product.care_level === "EASY"
            ? LABELS.catalog.EASY_CARE
            : LABELS.catalog.MODERATE_CARE}
          <span aria-hidden="true"> · </span>
          {product.light_requirement === "LOW"
            ? LABELS.catalog.LOW_LIGHT
            : LABELS.catalog.DAILY_GREEN}
        </p>
        <div className="product-price-row">
          <span className="product-price">
            {product.min_sale_price_vnd
              ? formatCurrencyVND(product.min_sale_price_vnd)
              : LABELS.common.CONTACT}
          </span>
          {onQuickView ? (
            <ButtonCommon
              variant="unstyled"
              className="product-quick-view"
              type="button"
              onClick={() => onQuickView(product)}
              aria-label={PRODUCT_LABELS.detail(product.name)}
            >
              <Plus size={17} strokeWidth={1.4} />
            </ButtonCommon>
          ) : (
            <LinkCommon
              to={detailPath}
              className="product-quick-view"
              aria-label={PRODUCT_LABELS.detail(product.name)}
            >
              <ArrowUpRight size={17} strokeWidth={1.4} />
            </LinkCommon>
          )}
        </div>
      </div>
    </article>
  );
}
