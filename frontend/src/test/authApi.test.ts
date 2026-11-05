import { afterEach, describe, expect, it, vi } from "vitest";
import { authApi } from "@/features/auth/api/authApi";
import { httpClient } from "@/services/api";
import { API_ENDPOINTS } from "@/constants";
import { MESSAGES } from "@/constants/messages";

const data = {
  user: { id: "customer-1", email: "an@example.com", full_name: "Nguyễn An", phone: "0912345678", role: "CUSTOMER", is_active: true },
  tokens: { access: "access-token", refresh: "refresh-token" },
};

afterEach(() => vi.restoreAllMocks());

describe("registration API contract", () => {
  it("sends the backend phone field and reads the session and profile", async () => {
    const post = vi.spyOn(httpClient, "post").mockResolvedValue({ data: { success: true, data } });
    const response = await authApi.register({ email: data.user.email, full_name: data.user.full_name, password: "MatKhau123", phone_number: data.user.phone });
    expect(post).toHaveBeenCalledWith(API_ENDPOINTS.AUTH.REGISTER, { email: data.user.email, full_name: data.user.full_name, password: "MatKhau123", phone: data.user.phone });
    expect(response.tokens).toEqual(data.tokens);
    expect(response.user.phone_number).toBe(data.user.phone);
  });

  it("supports the top-level response and an omitted optional phone", async () => {
    const post = vi.spyOn(httpClient, "post").mockResolvedValue({ data });
    await authApi.register({ email: data.user.email, full_name: data.user.full_name, password: "MatKhau123" });
    expect(post).toHaveBeenCalledWith(API_ENDPOINTS.AUTH.REGISTER, expect.objectContaining({ phone: "" }));
  });

  it.each([null, { user: data.user }, { ...data, tokens: { access: 1, refresh: "token" } }])("rejects a malformed response before authenticating (%j)", async (response) => {
    vi.spyOn(httpClient, "post").mockResolvedValue({ data: response });
    await expect(authApi.register({ email: data.user.email, full_name: data.user.full_name, password: "MatKhau123" })).rejects.toThrow(MESSAGES.INVALID_API_RESPONSE);
  });
});
