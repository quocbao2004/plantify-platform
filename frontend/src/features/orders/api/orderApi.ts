import { API_ENDPOINTS } from "@/constants";
import { httpClient } from "@/services/api";
import type { CheckoutPayload } from "@/features/checkout/types";
import type { Order } from "../types";

interface OrderPage {
  data: Order[];
  pagination: { next: string | null; previous: string | null };
}

export const orderApi = {
  async list(params: { page?: number; checkout_key?: string; payment_ref?: string }, signal?: AbortSignal) {
    const { data } = await httpClient.get<OrderPage>(API_ENDPOINTS.ORDERS.ORDERS, { params: { ...params, mine: true }, signal });
    return data;
  },
  async checkout(payload: CheckoutPayload) {
    const { data } = await httpClient.post<Order>(API_ENDPOINTS.ORDERS.CHECKOUT, payload);
    return data;
  },
  async resumeVnpay(orderId: string) {
    const { data } = await httpClient.post<{ payment_url: string }>(API_ENDPOINTS.PAYMENTS.VNPAY + orderId + "/resume/");
    return data.payment_url;
  },
};
