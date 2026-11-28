import { LinkCommon } from "@/components/common/LinkCommon";
import { ButtonCommon } from "@/components/common/ButtonCommon";
import { LABELS } from "@/constants/labels";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation, useSearchParams } from "react-router-dom";

import { ClipboardList, ArrowRight } from "lucide-react";

import { EmptyState, LoadingOverlay } from "@/components/common";
import { useAuthStore } from "@/stores/authStore";
import { formatCurrencyVND } from "@/utils/formatCurrency";
import { getApiErrorMessage } from "@/utils/apiError";
import { orderApi } from "../api/orderApi";
import type { OrderStatus } from "../types";

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "Chờ xử lý",
  PAID: "Đã thanh toán",
  PROCESSING: "Đang đóng gói",
  DELIVERING: "Đang giao",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
};

export function OrderListPage() {
  const { state } = useLocation();
  const [params] = useSearchParams();
  const paymentRef = params.get("payment_ref") || undefined;
  const invalidReturn = params.get("payment_error") === "invalid";
  const userId = useAuthStore((auth) => auth.user?.id);
  const [page, setPage] = useState(1);
  const orders = useQuery({
    queryKey: ["orders", userId, page, paymentRef],
    queryFn: ({ signal }) => orderApi.list({ page, payment_ref: paymentRef }, signal),
    refetchInterval: (query) => {
      const payment = query.state.data?.data[0]?.payment;
      return paymentRef && payment?.status === "PENDING" && !payment.expired ? 5000 : false;
    },
    meta: { silentError: true },
  });
  const resumePayment = useMutation({
    mutationFn: orderApi.resumeVnpay,
    onSuccess: (url) => window.location.assign(url),
    onError: () => { void orders.refetch(); },
    meta: { silentError: true },
  });

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-surface-200">
        <h1 className="text-2xl font-bold tracking-tight text-surface-900">
          {LABELS.orders.TITLE}
        </h1>
        <p className="text-xs text-surface-500 mt-1">
          {LABELS.orders.DESCRIPTION}
        </p>
        {paymentRef && <LinkCommon to="/orders" className="mt-2 text-sm underline">Xem tất cả đơn hàng</LinkCommon>}
      </div>

      {invalidReturn && <p role="alert">Không xác thực được thông tin trả về từ VNPay. Bạn có thể xem trạng thái trong đơn hàng.</p>}
      {resumePayment.error && <p role="alert" className="text-red-700">{getApiErrorMessage(resumePayment.error)}</p>}
      {typeof state?.orderCode === "string" && (
        <p role="status" className="break-words rounded-md bg-emerald-50 p-4 text-emerald-800">
          Đặt hàng thành công. Mã đơn <strong>{state.orderCode}</strong>
        </p>
      )}
      {orders.isLoading && <LoadingOverlay />}
      {orders.isError && (
        <div role="alert" className="space-y-3">
          <p>Chưa tải được lịch sử đơn hàng.</p>
          <ButtonCommon onClick={() => void orders.refetch()} isLoading={orders.isFetching}>Thử lại</ButtonCommon>
        </div>
      )}
      {orders.data?.data.length === 0 && paymentRef && <p role="status">Không tìm thấy giao dịch VNPay trong tài khoản này.</p>}
      {orders.data?.data.length === 0 && !paymentRef && <EmptyState
        icon={<ClipboardList className="w-6 h-6 text-surface-400" />}
        title={LABELS.orders.EMPTY_TITLE}
        description={LABELS.orders.EMPTY_DESCRIPTION}
        action={
          <LinkCommon to="/catalog" variant="primary" size="sm">
            {LABELS.orders.SHOP_NOW}
            <ArrowRight className="w-3.5 h-3.5" />
          </LinkCommon>
        }
      />}
      {orders.data?.data.map((order) => (
        <details key={order.id} open={Boolean(paymentRef) || order.order_code === state?.orderCode} className="rounded-md border border-surface-200 bg-white p-4">
          <summary className="cursor-pointer space-y-1">
            <strong className="break-words">{order.order_code}</strong>
            <p className="text-sm text-surface-600">
              {statusLabels[order.status]} · {formatCurrencyVND(Number(order.total_amount))}
            </p>
          </summary>
          <ul className="my-3 space-y-2 border-y border-surface-200 py-3 text-sm">
            {order.details.map((item) => (
              <li key={item.id} className="flex justify-between gap-3">
                <span>{item.plant_name}{item.plant_detail_info.size && " (" + item.plant_detail_info.size + ")"} × {item.quantity}</span>
                <span className="shrink-0">{formatCurrencyVND(Number(item.total_price))}</span>
              </li>
            ))}
            <li className="flex justify-between gap-3">
              <span>{LABELS.checkout.SHIPPING}</span>
              <span>{formatCurrencyVND(Number(order.shipping_fee))}</span>
            </li>
          </ul>
          <p className="break-words text-sm">{order.recipient_name} · {order.recipient_phone}</p>
          <p className="break-words text-sm text-surface-600">{order.shipping_address}</p>
          {order.notes && <p className="break-words text-sm text-surface-600">{order.notes}</p>}
          {order.payment?.method === "VNPAY" && (
            <div className="mt-3 space-y-2 border-t border-surface-200 pt-3 text-sm">
              {order.payment.status === "SUCCESS" && <p role="status">VNPay đã xác nhận thanh toán.</p>}
              {order.payment.status === "PENDING" && (
                <p role="status">{order.payment.expired ? "Phiên VNPay đã hết hạn. Đơn đang chờ đối soát." : "Đang chờ VNPay xác nhận thanh toán."}</p>
              )}
              {["CANCELLED", "FAILED"].includes(order.payment.status) && <p role="status">Thanh toán VNPay chưa thành công.</p>}
              {order.payment.can_resume && (
                <ButtonCommon size="sm" disabled={resumePayment.isPending} onClick={() => resumePayment.mutate(order.id)}>
                  Tiếp tục thanh toán VNPay
                </ButtonCommon>
              )}
            </div>
          )}
        </details>
      ))}
      {orders.data && (page > 1 || orders.data.pagination.next) && (
        <div className="flex gap-2">
          <ButtonCommon variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>{LABELS.catalog.PREVIOUS_PAGE}</ButtonCommon>
          <ButtonCommon variant="outline" disabled={!orders.data.pagination.next} onClick={() => setPage(page + 1)}>{LABELS.catalog.NEXT_PAGE}</ButtonCommon>
        </div>
      )}
    </div>
  );
}
