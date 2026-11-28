import { ButtonCommon } from "@/components/common/ButtonCommon";
import { LinkCommon } from "@/components/common/LinkCommon";
import { LABELS } from "@/constants/labels";
import { useState } from "react";

import { ArrowRight, Droplets, Leaf, Sun } from "lucide-react";
import { ModalCommon } from "@/components/common/ModalCommon";
import { LoadingOverlay } from "@/components/common/LoadingOverlay";
import { formatCurrencyVND } from "@/utils";
import { ProductCard } from "../ProductCard";
import { useCategories, useProducts } from "../../hooks/useProducts";
import { CARE_LEVEL_LABELS, LIGHT_REQUIREMENT_LABELS } from "../../constants";
import type { Product, ProductQueryParams } from "../../types";

const featuredParams: ProductQueryParams = { page_size: 4, sort_by: "popular" };

export function HomeFeaturedPlants() {
  const [filter, setFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { data: categories } = useCategories({ silentError: true });
  const filters: { value: string; label: string; params: ProductQueryParams }[] = [
    { value: "all", label: LABELS.home.FEATURED_ALL, params: {} },
    { value: "easy", label: LABELS.catalog.EASY_CARE, params: { care_level: "EASY" } },
    ...(categories?.results.slice(0, 2) ?? []).map((category) => ({
      value: category.id,
      label: category.name,
      params: { category: category.slug },
    })),
  ];
  const activeFilter = filters.find((item) => item.value === filter) ?? filters[0];
  const filterParams = activeFilter.params;
  const { data, isLoading, isError, isFetching, refetch } = useProducts(
    { ...featuredParams, ...filterParams },
    { silentError: true },
  );
  const products = data?.results ?? [];
  const previewPrice = selectedProduct?.min_sale_price_vnd;
  const previewVariant = previewPrice
    ? selectedProduct?.variants?.find((variant) => variant.sale_price_vnd === previewPrice)
    : undefined;

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
          {filters.map((item) => (
            <ButtonCommon
              variant="unstyled"
              key={item.value}
              className={`product-filter${activeFilter.value === item.value ? " is-active" : ""}`}
              type="button"
              aria-pressed={activeFilter.value === item.value}
              onClick={() => setFilter(item.value)}
            >
              {item.label}
            </ButtonCommon>
          ))}
        </div>
        <div
          className="home-products-grid"
          aria-live="polite"
          aria-busy={isLoading}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={setSelectedProduct}
            />
          ))}
        </div>
        {isLoading && <LoadingOverlay message={LABELS.catalog.LOADING} />}
        {!isLoading && products.length === 0 && (
          <div className="home-empty-state">
            <Leaf size={28} strokeWidth={1.3} />
            <p role={isError ? "alert" : "status"}>
              {isError ? LABELS.home.FEATURED_ERROR : LABELS.catalog.EMPTY_TITLE}
            </p>
            {isError ? (
              <ButtonCommon variant="outline" isLoading={isFetching} onClick={() => void refetch()}>
                {LABELS.home.RETRY}
              </ButtonCommon>
            ) : activeFilter.value !== "all" && (
              <ButtonCommon variant="unstyled" className="store-text-link" onClick={() => setFilter("all")}>
                {LABELS.home.ALL_PLANTS}
                <ArrowRight size={16} />
              </ButtonCommon>
            )}
          </div>
        )}
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
                {previewPrice ? formatCurrencyVND(previewPrice) : LABELS.common.CONTACT}
                {previewVariant && (
                  <span className="ml-2 text-xs font-medium">{previewVariant.size_display}</span>
                )}
              </p>
              <p>{selectedProduct.description}</p>
              <div className="plant-care-facts">
                {selectedProduct.light_requirement && (
                  <p>
                    <Sun size={18} />
                    {LIGHT_REQUIREMENT_LABELS[selectedProduct.light_requirement]}
                  </p>
                )}
                {selectedProduct.care_level && (
                  <p>
                    <Droplets size={18} />
                    {CARE_LEVEL_LABELS[selectedProduct.care_level]}
                  </p>
                )}
              </div>
              {selectedProduct.care_instructions ? (
                <p className="quick-view-care">
                  {selectedProduct.care_instructions}
                </p>
              ) : null}
              <LinkCommon
                className="store-primary-button"
                to={{
                  pathname: `/catalog/${selectedProduct.slug || selectedProduct.id}`,
                  search: previewVariant ? `?variant=${encodeURIComponent(previewVariant.id)}` : "",
                }}
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
