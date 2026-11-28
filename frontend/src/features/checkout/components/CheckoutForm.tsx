import { useRef, useState } from "react";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { ButtonCommon } from "@/components/common/ButtonCommon";
import { FormCommon } from "@/components/common/FormCommon";
import { TextFieldCommon } from "@/components/common/TextFieldCommon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { LABELS } from "@/constants/labels";
import { useCartStore } from "@/features/cart/cartStore";
import { canBuyCartLine } from "@/features/cart/hooks/useCartQuote";
import type { CartQuote } from "@/features/cart/types";
import { orderApi } from "@/features/orders/api/orderApi";
import type { Order } from "@/features/orders/types";
import type { User } from "@/types";
import { getApiErrorMessage, getApiFieldErrors } from "@/utils/apiError";
import { formatCurrencyVND } from "@/utils/formatCurrency";
import type { DeliveryDetails } from "../types";

const phonePattern = /^(?:0[35789][0-9]{8}|\+?84[35789][0-9]{8})$/;

interface CheckoutFormProps {
  user: User;
  quote: CartQuote;
  quoteReady: boolean;
  onRefreshQuote: () => Promise<unknown>;
  onSuccess: (order: Order, checkoutKey: string) => void;
}

export function CheckoutForm({ user, quote, quoteReady, onRefreshQuote, onSuccess }: CheckoutFormProps) {
  const inFlight = useRef(false);
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "VNPAY">(quote.vnpay_enabled ? "VNPAY" : "CASH");
  const { register, handleSubmit, setError, clearErrors, formState: { errors, isSubmitting } } = useForm<DeliveryDetails>({
    defaultValues: {
      recipient_name: user.full_name ?? "",
      recipient_phone: user.phone_number ?? "",
      shipping_address: "",
      notes: "",
    },
  });
  const canOrder = quote.items.every(canBuyCartLine);
  const canUsePaymentMethod = paymentMethod === "CASH" || quote.vnpay_enabled;

  const submit = async (delivery: DeliveryDetails) => {
    if (inFlight.current || !canOrder || !quoteReady || !canUsePaymentMethod) return;
    inFlight.current = true;
    clearErrors("root");
    try {
      const checkoutKey = useCartStore.getState().beginCheckout(user.id);
      const order = await orderApi.checkout({
        ...delivery,
        checkout_key: checkoutKey,
        payment_method: paymentMethod,
        shipping_fee: quote.shipping_fee,
        items: quote.items.map((item) => ({
          plant_detail: item.plant_detail,
          quantity: item.quantity,
          unit_price: item.unit_price ?? "0",
        })),
      });
      onSuccess(order, checkoutKey);
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error);
      for (const name of ["recipient_name", "recipient_phone", "shipping_address", "notes"] as const) {
        if (fieldErrors[name]) setError(name, { message: fieldErrors[name] });
      }
      setError("root", { message: getApiErrorMessage(error) });
      if (isAxiosError(error) && error.response?.status === 409) await onRefreshQuote();
    } finally {
      inFlight.current = false;
    }
  };

  return (
    <FormCommon noValidate onSubmit={handleSubmit(submit)} className="grid items-start gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader><CardTitle>Thông tin người nhận</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <TextFieldCommon
            label="Tên người nhận"
            autoComplete="shipping name"
            required
            maxLength={255}
            error={errors.recipient_name?.message}
            {...register("recipient_name", { setValueAs: (value: string) => value.trim(), required: "Nhập tên người nhận." })}
          />
          <TextFieldCommon
            label="Số điện thoại nhận hàng"
            type="tel"
            autoComplete="shipping tel"
            required
            maxLength={20}
            error={errors.recipient_phone?.message}
            {...register("recipient_phone", {
              setValueAs: (value: string) => value.trim(),
              required: "Nhập số điện thoại nhận hàng.",
              pattern: { value: phonePattern, message: "Số điện thoại Việt Nam không hợp lệ." },
            })}
          />
          <TextFieldCommon
            label="Địa chỉ nhận hàng"
            autoComplete="shipping street-address"
            required
            maxLength={500}
            error={errors.shipping_address?.message}
            {...register("shipping_address", { setValueAs: (value: string) => value.trim(), required: "Nhập địa chỉ nhận hàng." })}
          />
          <TextFieldCommon label="Ghi chú (không bắt buộc)" maxLength={1000} error={errors.notes?.message} {...register("notes")} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>{LABELS.checkout.SUMMARY}</CardTitle></CardHeader>
        <CardContent className="space-y-4 text-sm">
          <ul className="space-y-2">
            {quote.items.map((item) => (
              <li key={item.plant_detail} className="flex justify-between gap-3">
                <span>{item.name ?? "Cây không còn được bán"}{item.size && " (" + item.size + ")"} × {item.quantity}</span>
                <span className="shrink-0">{formatCurrencyVND(Number(item.line_total))}</span>
              </li>
            ))}
          </ul>
          <dl className="space-y-2 border-y border-surface-200 py-3">
            <div className="flex justify-between gap-2"><dt>{LABELS.checkout.SUBTOTAL}</dt><dd>{formatCurrencyVND(Number(quote.subtotal))}</dd></div>
            <div className="flex justify-between gap-2"><dt>{LABELS.checkout.SHIPPING}</dt><dd>{formatCurrencyVND(Number(quote.shipping_fee))}</dd></div>
            <div className="flex justify-between gap-2 font-semibold"><dt>{LABELS.checkout.TOTAL}</dt><dd>{formatCurrencyVND(Number(quote.total))}</dd></div>
          </dl>
          <fieldset className="space-y-2" disabled={isSubmitting}>
            <legend className="font-semibold">Phương thức thanh toán</legend>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment_method"
                checked={paymentMethod === "VNPAY"}
                disabled={!quote.vnpay_enabled}
                aria-describedby={quote.vnpay_enabled ? undefined : "vnpay-unavailable"}
                onChange={() => setPaymentMethod("VNPAY")}
              />
              Thanh toán qua VNPay
            </label>
            {!quote.vnpay_enabled && (
              <p id="vnpay-unavailable" className="pl-6 text-xs text-surface-600">
                VNPay hiện chưa khả dụng. Bạn có thể thanh toán khi nhận hàng.
              </p>
            )}
            <label className="flex items-center gap-2">
              <input type="radio" name="payment_method" checked={paymentMethod === "CASH"} onChange={() => setPaymentMethod("CASH")} />
              Thanh toán khi nhận hàng (COD)
            </label>
          </fieldset>
          {!canOrder && <p role="alert" className="text-red-700">Một số cây không đủ số lượng. Hãy quay lại giỏ hàng để cập nhật.</p>}
          {errors.root?.message && <p role="alert" className="text-red-700">{errors.root.message}</p>}
          <ButtonCommon type="submit" className="w-full" isLoading={isSubmitting} disabled={!canOrder || !quoteReady || !canUsePaymentMethod}>
            {paymentMethod === "VNPAY" ? "Thanh toán qua VNPay" : "Đặt hàng"}
          </ButtonCommon>
        </CardContent>
      </Card>
    </FormCommon>
  );
}
