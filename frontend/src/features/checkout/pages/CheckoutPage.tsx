import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, useNavigate } from "react-router-dom";
import { LoadingOverlay } from "@/components/common/LoadingOverlay";
import { LinkCommon } from "@/components/common/LinkCommon";
import { LABELS } from "@/constants/labels";
import { authApi } from "@/features/auth/api/authApi";
import { useCartStore } from "@/features/cart/cartStore";
import { useCartQuote } from "@/features/cart/hooks/useCartQuote";
import { orderApi } from "@/features/orders/api/orderApi";
import type { Order } from "@/features/orders/types";
import { useAuthStore } from "@/stores/authStore";
import { CheckoutForm } from "../components/CheckoutForm";

export function CheckoutPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isFinishing = useRef(false);
  const user = useAuthStore((state) => state.user);
  const [previousAttempt] = useState(() => useCartStore.getState().checkoutAttempt);
  const retryKey = previousAttempt && previousAttempt.userId === user?.id ? previousAttempt.key : undefined;
  const cart = useCartQuote();

  const profile = useQuery({
    queryKey: ["checkout-profile", user?.id],
    queryFn: authApi.getMe,
    staleTime: 0,
    enabled: cart.items.length > 0,
    meta: { silentError: true },
  });
  const recovered = useQuery({
    queryKey: ["order-attempt", user?.id, retryKey],
    queryFn: ({ signal }) => orderApi.list({ checkout_key: retryKey }, signal),
    select: (page) => page.data[0],
    enabled: Boolean(retryKey && cart.items.length),
    staleTime: 0,
    meta: { silentError: true },
  });

  const showOrder = useCallback((order: Order, checkoutKey: string) => {
    isFinishing.current = true;
    useCartStore.getState().finishCheckout(checkoutKey);
    void queryClient.invalidateQueries({ queryKey: ["orders"] });
    void queryClient.invalidateQueries({ queryKey: ["product"] });
    if (order.payment_url) {
      window.location.assign(order.payment_url);
      return;
    }
    navigate("/orders", { replace: true, state: { orderCode: order.order_code } });
  }, [navigate, queryClient]);

  useEffect(() => {
    if (recovered.data && retryKey) showOrder(recovered.data, retryKey);
  }, [recovered.data, retryKey, showOrder]);

  if (isFinishing.current) return <LoadingOverlay />;
  if (!cart.items.length) return <Navigate to="/cart" replace />;
  if (profile.isLoading || cart.isLoading || recovered.isLoading || recovered.data) return <LoadingOverlay />;

  const recipient = profile.data ?? user;

  return (
    <div className="space-y-6">
      <div className="border-b border-surface-200 pb-4">
        <h1 className="text-2xl font-bold text-surface-900">{LABELS.checkout.TITLE}</h1>
        <LinkCommon to="/cart" className="mt-2 text-sm underline">Quay lại giỏ hàng</LinkCommon>
      </div>
      {cart.data && recipient ? (
        <CheckoutForm
          key={recipient.id}
          user={recipient}
          quote={cart.data}
          quoteReady={!cart.isError && !cart.isFetching}
          onRefreshQuote={() => cart.refetch()}
          onSuccess={showOrder}
        />
      ) : <p role="alert">Chưa tải được thông tin thanh toán. Hãy quay lại giỏ hàng và thử lại.</p>}
    </div>
  );
}
