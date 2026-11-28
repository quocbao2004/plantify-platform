import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, it, expect, vi } from "vitest";
import { authApi } from "@/features/auth/api/authApi";
import { cartApi } from "@/features/cart/api/cartApi";
import { useCartStore } from "@/features/cart/cartStore";
import type { CartQuote } from "@/features/cart/types";
import { CheckoutForm } from "@/features/checkout/components/CheckoutForm";
import { CheckoutPage } from "@/features/checkout/pages/CheckoutPage";
import { orderApi } from "@/features/orders/api/orderApi";
import type { Order } from "@/features/orders/types";
import { useAuthStore } from "@/stores/authStore";
import type { User } from "@/types";

const user: User = { id: "buyer-id", email: "buyer@example.com", full_name: "Khách thử",
  role: "CUSTOMER", is_active: true, created_at: "", updated_at: "" };
const item = { plant_detail: "variant-id", quantity: 1 };
const quote: CartQuote = {
  items: [{ ...item, name: "Kim tiền", slug: "kim-tien", size: "M",
    unit_price: "299000.00", line_total: "299000.00", available_quantity: 2 }],
  subtotal: "299000.00", shipping_fee: "25000.00", total: "324000.00", vnpay_enabled: false,
};
const order: Order = {
  id: "order-id", order_code: "PL-DEMO", status: "PENDING",
  shipping_fee: "25000.00", total_amount: "324000.00", details: [],
  recipient_name: "Khách thử", recipient_phone: "0912345678", shipping_address: "Địa chỉ thử",
  notes: "", created_at: "", updated_at: "",
};

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  useCartStore.setState({ items: [], checkoutAttempt: null });
  useAuthStore.getState().logout();
});

function OrderConfirmation() {
  return <p>Mã đơn {useLocation().state?.orderCode}</p>;
}

it("fills the profile, requires missing fields and opens the created order after clearing the cart", async () => {
  useAuthStore.getState().setAuth(user, { access: "test-access", refresh: "test-refresh" });
  useCartStore.setState({ items: [item] });
  vi.spyOn(authApi, "getMe").mockResolvedValue(user);
  vi.spyOn(cartApi, "quote").mockResolvedValue(quote);
  const checkout = vi.spyOn(orderApi, "checkout").mockResolvedValue(order);
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={["/checkout"]}>
        <Routes>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/cart" element={<p>Giỏ hàng</p>} />
          <Route path="/orders" element={<OrderConfirmation />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );

  expect(await screen.findByLabelText("Tên người nhận")).toHaveValue("Khách thử");
  expect(screen.getByRole("radio", { name: "Thanh toán qua VNPay" })).toBeDisabled();
  expect(screen.getByText(/VNPay hiện chưa khả dụng/)).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Đặt hàng" }));
  expect(await screen.findByText("Nhập số điện thoại nhận hàng.")).toBeVisible();
  expect(screen.getByText("Nhập địa chỉ nhận hàng.")).toBeVisible();
  expect(checkout).not.toHaveBeenCalled();

  fireEvent.change(screen.getByLabelText("Số điện thoại nhận hàng"), { target: { value: "0912345678" } });
  fireEvent.change(screen.getByLabelText("Địa chỉ nhận hàng"), { target: { value: "Địa chỉ thử" } });
  fireEvent.click(screen.getByRole("button", { name: "Đặt hàng" }));
  expect(await screen.findByText("Mã đơn PL-DEMO")).toBeVisible();
  expect(checkout).toHaveBeenCalledWith(expect.objectContaining({
    recipient_name: "Khách thử", shipping_address: "Địa chỉ thử", payment_method: "CASH",
    items: [{ ...item, unit_price: "299000.00" }],
  }));
  expect(useCartStore.getState().items).toEqual([]);
  client.clear();
});

it("submits the VNPay payment method and passes through the gateway URL", async () => {
  const onlineOrder = { ...order, payment_url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html" };
  const checkout = vi.spyOn(orderApi, "checkout").mockResolvedValue(onlineOrder);
  const onSuccess = vi.fn();
  render(<CheckoutForm
    user={{ ...user, phone_number: order.recipient_phone }}
    quote={{ ...quote, vnpay_enabled: true }}
    quoteReady
    onRefreshQuote={vi.fn()}
    onSuccess={onSuccess}
  />);

  expect(screen.getByRole("radio", { name: "Thanh toán qua VNPay" })).toBeEnabled();
  fireEvent.change(screen.getByLabelText("Địa chỉ nhận hàng"), { target: { value: order.shipping_address } });
  fireEvent.click(screen.getByRole("button", { name: "Thanh toán qua VNPay" }));

  await vi.waitFor(() => expect(onSuccess).toHaveBeenCalledWith(onlineOrder, expect.any(String)));
  expect(checkout).toHaveBeenCalledWith(expect.objectContaining({ payment_method: "VNPAY" }));
});
