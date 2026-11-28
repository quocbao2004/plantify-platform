import { LinkCommon } from "@/components/common/LinkCommon";
import { ButtonCommon } from "@/components/common/ButtonCommon";
import { LABELS } from "@/constants/labels";
import React from "react";

import { ShoppingBag, ArrowRight } from "lucide-react";

import { EmptyState, LoadingOverlay } from "@/components/common";
import { formatCurrencyVND } from "@/utils/formatCurrency";
import { MAX_CART_QUANTITY, useCartStore } from "../cartStore";
import { canBuyCartLine, useCartQuote } from "../hooks/useCartQuote";

export const CartPage: React.FC = () => {
  const { items, data: quote, isLoading, isError, isFetching, refetch } = useCartQuote();
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-surface-200">
        <h1 className="text-2xl font-bold tracking-tight text-surface-900">
          {LABELS.cart.TITLE}
        </h1>
        <p className="text-xs text-surface-500 mt-1">
          {LABELS.cart.DESCRIPTION}
        </p>
      </div>

      {items.length === 0 && <EmptyState
        icon={<ShoppingBag className="w-6 h-6 text-surface-400" />}
        title={LABELS.cart.EMPTY_TITLE}
        description={LABELS.cart.EMPTY_DESCRIPTION}
        action={
          <LinkCommon to="/catalog" variant="primary" size="sm">
            {LABELS.cart.EXPLORE}
            <ArrowRight className="w-3.5 h-3.5" />
          </LinkCommon>
        }
      />}
      {isLoading && <LoadingOverlay />}
      {isError && (
        <div className="space-y-3" role="alert">
          <p>Chưa tải được giá và tồn kho. Giỏ hàng vẫn được lưu trên thiết bị này.</p>
          <ButtonCommon onClick={() => void refetch()} isLoading={isFetching}>Thử lại</ButtonCommon>
        </div>
      )}
      {quote && (
        <>
          <ul className="divide-y divide-surface-200 rounded-md border border-surface-200 bg-white">
            {quote.items.map((item) => (
              <li key={item.plant_detail} className="flex flex-wrap items-center justify-between gap-4 p-4">
                <div className="min-w-0 flex-1">
                  {item.slug ? (
                    <LinkCommon className="font-semibold hover:underline" to={`/catalog/${item.slug}`}>
                      {item.name}
                    </LinkCommon>
                  ) : <p className="font-semibold">Cây không còn được bán</p>}
                  {item.size && <p className="text-sm text-surface-500">Kích cỡ {item.size}</p>}
                  {item.unit_price !== null && <p>{formatCurrencyVND(Number(item.unit_price))}</p>}
                  {!canBuyCartLine(item) && item.slug && (
                    <p className="text-sm text-red-600">
                      {item.available_quantity ? `Chỉ còn ${item.available_quantity} cây.` : "Đã hết hàng."}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <ButtonCommon variant="outline" aria-label={`Giảm số lượng ${item.name ?? "cây"}`} disabled={item.quantity <= 1} onClick={() => setQuantity(item.plant_detail, item.quantity - 1)}>−</ButtonCommon>
                  <span>{item.quantity}</span>
                  <ButtonCommon variant="outline" aria-label={`Tăng số lượng ${item.name ?? "cây"}`} disabled={item.quantity >= Math.min(item.available_quantity, MAX_CART_QUANTITY)} onClick={() => setQuantity(item.plant_detail, item.quantity + 1)}>+</ButtonCommon>
                  <ButtonCommon variant="ghost" aria-label={`Xóa ${item.name ?? "cây"} khỏi giỏ hàng`} onClick={() => removeItem(item.plant_detail)}>Xóa</ButtonCommon>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p>{LABELS.checkout.SUBTOTAL} <strong>{formatCurrencyVND(Number(quote.subtotal))}</strong></p>
            {!isError && quote.items.every(canBuyCartLine) && (
              <LinkCommon to="/checkout" variant="primary">Thanh toán</LinkCommon>
            )}
          </div>
        </>
      )}
    </div>
  );
};
