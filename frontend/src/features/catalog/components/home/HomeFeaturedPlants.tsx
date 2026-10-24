import { ButtonCommon } from "@/components/common/ButtonCommon";
import { LinkCommon } from "@/components/common/LinkCommon";
import { LABELS } from "@/constants/labels";
import { useState } from "react";

import { ArrowRight, Droplets, Leaf, Sun } from "lucide-react";
import { ModalCommon } from "@/components/common/ModalCommon";
import { formatCurrencyVND } from "@/utils";
import { ProductCard } from "../ProductCard";
import { useProducts } from "../../hooks/useProducts";
import {
  homeProducts,
  homeFilters,
  type HomeFilter,
} from "../../constants/homeContent";
import { CARE_LEVEL_LABELS, LIGHT_REQUIREMENT_LABELS } from "../../constants";
import type { Product } from "../../types";

export function HomeFeaturedPlants() {
  const { data } = useProducts({ page_size: 4 }, { silentError: true });
  const [filter, setFilter] = useState<HomeFilter>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const products = data?.results.length ? data.results : homeProducts;
  const filteredProducts = products.filter((product) => {
    if (filter === "easy") return product.care_level === "EASY";
    if (filter === "indoor") {
      return (
        product.category_name.toLocaleLowerCase("vi").includes("trong nhà") ||
        product.light_requirement === "BRIGHT_INDIRECT" ||
        product.light_requirement === "MEDIUM"
      );
    }
    if (filter === "desktop")
      return product.category_name.toLocaleLowerCase("vi").includes("bàn");
    return true;
  });

  return (
    <>
      <section
        className="store-container home-section featured-section"
        id="featured"
        aria-labelledby="featured-heading"
      >
        <div className="section-heading">
          <div>
            <p className="section-eyebrow">{LABELS.home.FEATURED_EYEBROW}</p>
            <h2 id="featured-heading">{LABELS.home.FEATURED_TITLE}</h2>
          </div>
          <LinkCommon className="store-text-link" to="/catalog">
            {LABELS.home.ALL_PLANTS}
            <ArrowRight size={17} />
          </LinkCommon>
        </div>
        <div
          className="product-filter-list"
          role="group"
          aria-label={LABELS.home.FEATURED_FILTERS}
        >
          {homeFilters.map((item) => (
            <ButtonCommon
              variant="unstyled"
              key={item.value}
              className={`product-filter${filter === item.value ? " is-active" : ""}`}
              type="button"
              aria-pressed={filter === item.value}
              onClick={() => setFilter(item.value)}
            >
              {item.label}
            </ButtonCommon>
          ))}
        </div>
        <div
          className="home-products-grid"
          aria-live="polite"
          aria-atomic="false"
        >
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={setSelectedProduct}
              badge={
                filter === "all" && index === 0
                  ? LABELS.catalog.FAVORITE_BADGE
                  : undefined
              }
            />
          ))}
        </div>
        {filteredProducts.length === 0 ? (
          <div className="home-empty-state">
            <Leaf size={28} strokeWidth={1.3} />
            <p>{LABELS.home.EMPTY}</p>
            <ButtonCommon
              variant="unstyled"
              type="button"
              className="store-text-link"
              onClick={() => setFilter("all")}
            >
              {LABELS.home.EXPLORE_PLANTS}
              <ArrowRight size={16} />
            </ButtonCommon>
          </div>
        ) : null}
      </section>
      <ModalCommon
        open={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
        title={selectedProduct?.name || LABELS.catalog.QUICK_VIEW_TITLE}
        className="product-dialog"
      >
        {selectedProduct ? (
          <div className="product-dialog-grid">
            {selectedProduct.primary_image ? (
              <img
                className="product-dialog-image"
                src={selectedProduct.primary_image}
                alt={selectedProduct.name}
                width={500}
                height={500}
              />
            ) : null}
            <div className="product-dialog-copy">
              <p className="section-eyebrow">{selectedProduct.category_name}</p>
              <p className="quick-view-price">
                {selectedProduct.min_sale_price_vnd
                  ? formatCurrencyVND(selectedProduct.min_sale_price_vnd)
                  : LABELS.common.CONTACT}
              </p>
              <p>{selectedProduct.description}</p>
              <div className="plant-care-facts">
                <p>
                  <Sun size={18} />
                  {LIGHT_REQUIREMENT_LABELS[selectedProduct.light_requirement]}
                </p>
                <p>
                  <Droplets size={18} />
                  {CARE_LEVEL_LABELS[selectedProduct.care_level]}
                </p>
              </div>
              {selectedProduct.care_instructions ? (
                <p className="quick-view-care">
                  {selectedProduct.care_instructions}
                </p>
              ) : null}
              <LinkCommon
                className="store-primary-button"
                to={
                  selectedProduct.id.startsWith("showcase-")
                    ? `/catalog?search=${encodeURIComponent(selectedProduct.name)}`
                    : `/catalog/${selectedProduct.slug || selectedProduct.id}`
                }
                onClick={() => setSelectedProduct(null)}
              >
                {LABELS.catalog.STORE_CTA}
                <ArrowRight size={17} />
              </LinkCommon>
            </div>
          </div>
        ) : null}
      </ModalCommon>
    </>
  );
}
