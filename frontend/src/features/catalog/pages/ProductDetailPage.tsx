import { ButtonCommon } from "@/components/common/ButtonCommon";
import { LinkCommon } from "@/components/common/LinkCommon";
import { TextFieldCommon } from "@/components/common/TextFieldCommon";
import { LABELS, PRODUCT_LABELS, STORE_HOTLINE } from "@/constants/labels";
import { MESSAGES } from "@/constants/messages";
import React, { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  Phone,
  Sun,
  Droplets,
  ShieldCheck,
  Sprout,
} from "lucide-react";
import { useProductDetail } from "../hooks/useProductDetail";
import { Badge, Card } from "@/components/ui";
import { LoadingOverlay } from "@/components/common";
import { formatCurrencyVND } from "@/utils";
import { CARE_LEVEL_LABELS, LIGHT_REQUIREMENT_LABELS } from "../constants";
import { MAX_CART_QUANTITY, useCartStore } from "@/features/cart/cartStore";
import { notify } from "@/services/notifications";

export const ProductDetailPage: React.FC = () => {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);
  const { data: product, isLoading, error } = useProductDetail(idOrSlug || "");
  const [quantityInput, setQuantityInput] = useState("1");

  if (isLoading) {
    return (
      <LoadingOverlay
        message={LABELS.catalog.DETAIL_LOADING}
        className="min-h-[400px]"
      />
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-12 space-y-4">
        <h2 className="text-lg font-semibold text-surface-900">
          {LABELS.catalog.NOT_FOUND}
        </h2>
        <p className="text-xs text-surface-500">
          {LABELS.catalog.NOT_FOUND_DESCRIPTION}
        </p>
        <LinkCommon to="/catalog" variant="outline" size="sm">
          {LABELS.catalog.BACK}
        </LinkCommon>
      </div>
    );
  }

  const selectedVariantId = searchParams.get("variant");
  const selectedVariant = product.variants?.find((variant) => variant.id === selectedVariantId)
    ?? product.variants?.[0];
  const salePrice = selectedVariant ? selectedVariant.sale_price_vnd : product.min_sale_price_vnd;
  const stock = selectedVariant?.stock_quantity ?? 0;
  const canSell = Boolean(selectedVariant?.can_sell && selectedVariant.is_active && product.is_active);
  const quantity = Number(quantityInput);
  const validQuantity = Number.isSafeInteger(quantity) && quantity >= 1;
  const quantityInCart = cartItems.find((item) => item.plant_detail === selectedVariant?.id)?.quantity ?? 0;
  const totalQuantity = quantityInCart + quantity;
  const needsContact = canSell && validQuantity && totalQuantity > Math.min(stock, MAX_CART_QUANTITY);
  const canAddToCart = canSell && validQuantity && !needsContact;
  const contactMessage = totalQuantity > stock ? LABELS.catalog.STOCK_CONTACT : LABELS.catalog.ORDER_LIMIT_CONTACT;

  const addPlantToCart = () => {
    if (!selectedVariant || !canAddToCart) return;
    if (!addItem(selectedVariant.id, quantity, stock)) {
      notify.error(MESSAGES.CART_QUANTITY_LIMIT);
      return;
    }
    notify.success(MESSAGES.CART_ITEM_ADDED(product.name, quantity), {
      id: "cart-item-added",
      action: { label: LABELS.cart.VIEW, onClick: () => navigate("/cart") },
    });
  };

  return (
    <div className="space-y-6">
      <LinkCommon
        to="/catalog"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-surface-500 hover:text-surface-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        {LABELS.catalog.BACK_TO_PLANTS}
      </LinkCommon>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-surface-100 rounded-md border border-surface-200 overflow-hidden relative">
            {product.primary_image ? (
              <img
                src={product.primary_image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-surface-400">
                <Sprout className="w-16 h-16 stroke-[1.5]" />
                <span className="text-xs mt-2">
                  {LABELS.common.IMAGE_MISSING}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Product Details & Actions */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-surface-500">
                {product.category_name}
              </span>
              {product.care_level && (
                <Badge variant="outline">{CARE_LEVEL_LABELS[product.care_level]}</Badge>
              )}
            </div>
            <h1 className="text-2xl font-bold text-surface-900">
              {product.name}
            </h1>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-md bg-surface-100/60 border border-surface-200 space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-surface-500">
                {LABELS.catalog.SALE_PRICE}
              </span>
              <span className="text-2xl font-bold text-accent-700">
                {salePrice ? formatCurrencyVND(salePrice) : LABELS.common.CONTACT}
              </span>
            </div>
            {selectedVariant?.deposit_vnd ? (
              <div className="text-xs text-surface-600">
                <span>{LABELS.catalog.RENTAL_DEPOSIT} </span>
                <span className="font-semibold">
                  {formatCurrencyVND(selectedVariant.deposit_vnd)}
                </span>
              </div>
            ) : null}
          </div>

          {/* Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <fieldset className="space-y-2">
              <legend className="block text-xs font-medium text-surface-700">
                {LABELS.catalog.SIZE}
              </legend>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <ButtonCommon
                    key={v.id}
                    type="button"
                    variant={
                      selectedVariant?.id === v.id ? "primary" : "outline"
                    }
                    size="sm"
                    aria-pressed={selectedVariant?.id === v.id}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      params.set("variant", v.id);
                      setSearchParams(params, { replace: true, preventScrollReset: true });
                      setQuantityInput("1");
                    }}
                  >
                    {v.size_display}{" "}
                    {v.height_cm ? PRODUCT_LABELS.height(v.height_cm) : ""}
                  </ButtonCommon>
                ))}
              </div>
            </fieldset>
          )}

          {/* Care Attributes */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {product.light_requirement && <Card className="p-3 flex items-center gap-2.5">
              <Sun className="w-4 h-4 text-amber-500 shrink-0" />
              <div className="text-xs">
                <p className="text-surface-500">{LABELS.catalog.LIGHT}</p>
                <p className="font-medium">
                  {LIGHT_REQUIREMENT_LABELS[product.light_requirement]}
                </p>
              </div>
            </Card>}
            {product.care_level && <Card className="p-3 flex items-center gap-2.5">
              <Droplets className="w-4 h-4 text-blue-500 shrink-0" />
              <div className="text-xs">
                <p className="text-surface-500">{LABELS.catalog.CARE}</p>
                <p className="font-medium">
                  {CARE_LEVEL_LABELS[product.care_level]}
                </p>
              </div>
            </Card>}
          </div>

          {/* Action Buttons */}
          {canSell && (
            <TextFieldCommon
              label="Số lượng"
              type="number"
              inputMode="numeric"
              min={1}
              step={1}
              className="w-20"
              value={quantityInput}
              onChange={(event) => setQuantityInput(event.target.value)}
              error={validQuantity ? undefined : LABELS.catalog.INVALID_QUANTITY}
              helperText={needsContact ? contactMessage : undefined}
            />
          )}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-surface-200">
            {needsContact ? (
              <LinkCommon href={`tel:${STORE_HOTLINE.replace(/\s/g, "")}`} variant="primary" size="lg" className="flex-1">
                <Phone className="w-4 h-4" aria-hidden="true" />
                {LABELS.catalog.CONTACT_TO_ORDER}
              </LinkCommon>
            ) : (
              <ButtonCommon
                variant="primary"
                size="lg"
                className="flex-1"
                onClick={addPlantToCart}
                disabled={!canAddToCart}
              >
                <ShoppingCart className="w-4 h-4" aria-hidden="true" />
                {canSell ? LABELS.catalog.ADD_TO_CART : LABELS.catalog.UNAVAILABLE_FOR_PURCHASE}
              </ButtonCommon>
            )}
            <ButtonCommon variant="outline" size="lg" className="flex-1">
              <ShieldCheck className="w-4 h-4" />
              {LABELS.catalog.RENT}
            </ButtonCommon>
          </div>
        </div>
      </div>
    </div>
  );
};
