import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AxiosError, AxiosHeaders } from "axios";
import { LABELS } from "@/constants/labels";
import { MESSAGES, VALIDATION_MESSAGES } from "@/constants/messages";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { authApi } from "@/features/auth/api/authApi";
import { notify } from "@/services/notifications";
import { useAuthStore } from "@/stores/authStore";
import { STORAGE_KEYS } from "@/constants";
import { triggerGoogleLogin } from "@/services/socialAuth";
import { registerSchema } from "@/features/auth/schemas/authSchemas";

vi.mock("@/services/notifications", () => ({
  notify: { success: vi.fn(), error: vi.fn(), info: vi.fn(), dismiss: vi.fn() },
}));

vi.mock("@/services/socialAuth", () => ({ triggerGoogleLogin: vi.fn() }));

vi.mock("@/features/auth/api/authApi", () => ({
  authApi: { login: vi.fn(), register: vi.fn(), socialLogin: vi.fn() },
}));

beforeEach(() => {
  vi.resetAllMocks();
  useAuthStore.getState().logout();
});
afterEach(cleanup);

const authResponse = {
  user: { id: "customer-1", email: "nguyenvana@example.com", full_name: "Nguyễn Văn A", phone_number: "0912345678", role: "CUSTOMER" as const, is_active: true },
  tokens: { access: "access-token", refresh: "refresh-token" },
};

function fillForm(phone = "") {
  for (const [placeholder, value] of [
    [LABELS.auth.NAME_PLACEHOLDER, "Nguyễn Văn A"],
    [LABELS.auth.EMAIL_PLACEHOLDER, "nguyenvana@example.com"],
    [LABELS.auth.PHONE_PLACEHOLDER, phone],
    [LABELS.auth.NEW_PASSWORD_PLACEHOLDER, "MatKhau123"],
    [LABELS.auth.CONFIRM_PASSWORD_PLACEHOLDER, "MatKhau123"],
  ]) fireEvent.change(screen.getByPlaceholderText(placeholder), { target: { value } });
}

function apiError(status: number, data: unknown) {
  const error = new AxiosError("Request failed");
  error.response = { status, statusText: "Error", data, headers: {}, config: { headers: new AxiosHeaders() } };
  return error;
}

describe("RegisterPage and RegisterForm", () => {
  function renderRegister() {
    return render(
      <QueryProvider>
        <MemoryRouter initialEntries={["/register"]}>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<p>Trang chủ sau đăng ký</p>} />
          </Routes>
        </MemoryRouter>
      </QueryProvider>,
    );
  }

  it("renders the split-screen auth layout with branding and form fields", () => {
    renderRegister();

    expect(screen.getByRole("heading", { name: LABELS.auth.REGISTER_TITLE })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(LABELS.auth.NAME_PLACEHOLDER)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(LABELS.auth.EMAIL_PLACEHOLDER)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(LABELS.auth.PHONE_PLACEHOLDER)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(LABELS.auth.NEW_PASSWORD_PLACEHOLDER)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(LABELS.auth.CONFIRM_PASSWORD_PLACEHOLDER)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: LABELS.auth.CREATE_ACCOUNT })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: LABELS.home.HERO_ALT })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: LABELS.navigation.LOGIN })).toHaveAttribute("href", "/login");
  });

  it("validates required fields and displays validation messages", async () => {
    const { container } = renderRegister();
    fireEvent.submit(container.querySelector("form")!);

    await screen.findByText(VALIDATION_MESSAGES.NAME_MIN);
    expect(authApi.register).not.toHaveBeenCalled();
    expect(notify.error).toHaveBeenCalledWith(
      VALIDATION_MESSAGES.NAME_MIN,
      { id: "form-validation" },
    );
  });

  it("validates password match before submission", async () => {
    const { container } = renderRegister();

    fireEvent.change(screen.getByPlaceholderText(LABELS.auth.NAME_PLACEHOLDER), {
      target: { value: "Nguyễn Văn A" },
    });
    fireEvent.change(screen.getByPlaceholderText(LABELS.auth.EMAIL_PLACEHOLDER), {
      target: { value: "nguyenvana@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(LABELS.auth.NEW_PASSWORD_PLACEHOLDER), {
      target: { value: "12345678" },
    });
    fireEvent.change(screen.getByPlaceholderText(LABELS.auth.CONFIRM_PASSWORD_PLACEHOLDER), {
      target: { value: "mismatch123" },
    });

    fireEvent.submit(container.querySelector("form")!);

    await screen.findByText(VALIDATION_MESSAGES.PASSWORD_MISMATCH);
    expect(authApi.register).not.toHaveBeenCalled();
  });

  it("submits valid register payload to auth API and notifies on failure", async () => {
    const error = new AxiosError("Email already in use");
    error.response = {
      status: 400,
      statusText: "Bad Request",
      data: {},
      headers: {},
      config: { headers: new AxiosHeaders() },
    };
    vi.mocked(authApi.register).mockRejectedValueOnce(error);

    const { container } = renderRegister();

    fireEvent.change(screen.getByPlaceholderText(LABELS.auth.NAME_PLACEHOLDER), {
      target: { value: "Nguyễn Văn A" },
    });
    fireEvent.change(screen.getByPlaceholderText(LABELS.auth.EMAIL_PLACEHOLDER), {
      target: { value: "nguyenvana@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(LABELS.auth.PHONE_PLACEHOLDER), {
      target: { value: "0912345678" },
    });
    fireEvent.change(screen.getByPlaceholderText(LABELS.auth.NEW_PASSWORD_PLACEHOLDER), {
      target: { value: "MatKhau123" },
    });
    fireEvent.change(screen.getByPlaceholderText(LABELS.auth.CONFIRM_PASSWORD_PLACEHOLDER), {
      target: { value: "MatKhau123" },
    });

    fireEvent.submit(container.querySelector("form")!);

    await waitFor(() => {
      expect(authApi.register).toHaveBeenCalledWith({
        full_name: "Nguyễn Văn A",
        email: "nguyenvana@example.com",
        phone_number: "0912345678",
        password: "MatKhau123",
      });
    });

    await waitFor(() => {
      expect(notify.error).toHaveBeenCalledWith(MESSAGES.REGISTER_ERROR);
    });
  });

  it("creates a session, persists tokens and replaces the page with home after success", async () => {
    vi.mocked(authApi.register).mockResolvedValueOnce(authResponse);
    renderRegister();
    fillForm("0912345678");
    fireEvent.click(screen.getByRole("button", { name: LABELS.auth.CREATE_ACCOUNT }));
    await screen.findByText("Trang chủ sau đăng ký");
    expect(useAuthStore.getState()).toMatchObject({ isAuthenticated: true, user: authResponse.user });
    expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBe(authResponse.tokens.access);
    expect(localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)).toBe(authResponse.tokens.refresh);
    expect(notify.success).toHaveBeenCalledWith(MESSAGES.REGISTER_SUCCESS);
  });

  it("trims profile fields and supports registration without a phone", async () => {
    vi.mocked(authApi.register).mockResolvedValueOnce(authResponse);
    renderRegister();
    fillForm();
    fireEvent.change(screen.getByLabelText(LABELS.auth.FULL_NAME), { target: { value: "  Nguyễn Văn A  " } });
    fireEvent.change(screen.getByLabelText(LABELS.auth.EMAIL), { target: { value: "  NGUYENVANA@EXAMPLE.COM  " } });
    fireEvent.click(screen.getByRole("button", { name: LABELS.auth.CREATE_ACCOUNT }));
    await waitFor(() => expect(authApi.register).toHaveBeenCalledWith({
      full_name: "Nguyễn Văn A", email: "nguyenvana@example.com", phone_number: undefined, password: "MatKhau123",
    }));
    await screen.findByText("Trang chủ sau đăng ký");
  });

  it("toggles each password independently without submitting the form", () => {
    renderRegister();
    const password = screen.getByLabelText(LABELS.auth.PASSWORD);
    const confirmation = screen.getByLabelText(LABELS.auth.CONFIRM_PASSWORD);
    fireEvent.click(screen.getByRole("button", { name: LABELS.auth.SHOW_PASSWORD }));
    expect(password).toHaveAttribute("type", "text");
    expect(confirmation).toHaveAttribute("type", "password");
    fireEvent.click(screen.getByRole("button", { name: LABELS.auth.SHOW_CONFIRM_PASSWORD }));
    expect(confirmation).toHaveAttribute("type", "text");
    fireEvent.click(screen.getByRole("button", { name: LABELS.auth.HIDE_PASSWORD }));
    expect(password).toHaveAttribute("type", "password");
    expect(authApi.register).not.toHaveBeenCalled();
  });

  it("displays a duplicate email field error and permits correcting and resubmitting", async () => {
    const message = "Địa chỉ email này đã được sử dụng trên hệ thống.";
    vi.mocked(authApi.register)
      .mockRejectedValueOnce(apiError(409, { success: false, error: { code: "RESOURCE_CONFLICT", details: { email: [message] } } }))
      .mockResolvedValueOnce(authResponse);
    renderRegister();
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: LABELS.auth.CREATE_ACCOUNT }));
    await screen.findByText(message);
    expect(screen.getByLabelText(LABELS.auth.EMAIL)).toHaveAttribute("aria-invalid", "true");
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(notify.error).toHaveBeenCalledWith(message);
    fireEvent.change(screen.getByLabelText(LABELS.auth.EMAIL), { target: { value: "new@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: LABELS.auth.CREATE_ACCOUNT }));
    await screen.findByText("Trang chủ sau đăng ký");
    expect(authApi.register).toHaveBeenCalledTimes(2);
  });

  it("maps backend phone and password validation to the correct fields", async () => {
    vi.mocked(authApi.register).mockRejectedValueOnce(apiError(400, { error: { details: {
      phone: ["Số điện thoại không hợp lệ."], password: ["Mật khẩu này quá phổ biến."],
    } } }));
    renderRegister();
    fillForm("0912345678");
    fireEvent.click(screen.getByRole("button", { name: LABELS.auth.CREATE_ACCOUNT }));
    await screen.findByText("Mật khẩu này quá phổ biến.");
    expect(screen.getByLabelText(LABELS.auth.PASSWORD)).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText(LABELS.auth.PHONE_OPTIONAL)).toHaveAttribute("aria-invalid", "true");
  });

  it("preserves entered values and allows retry after a network failure", async () => {
    vi.mocked(authApi.register).mockRejectedValueOnce(new AxiosError("Network error"));
    renderRegister();
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: LABELS.auth.CREATE_ACCOUNT }));
    expect(await screen.findByRole("alert")).toHaveTextContent(MESSAGES.NETWORK_ERROR);
    expect(screen.getByLabelText(LABELS.auth.FULL_NAME)).toHaveValue("Nguyễn Văn A");
    expect(screen.getByRole("button", { name: LABELS.auth.CREATE_ACCOUNT })).toBeEnabled();
    expect(notify.error).toHaveBeenCalledTimes(1);
  });

  it("blocks repeated submissions and Google while account creation is pending", async () => {
    let resolve!: (value: typeof authResponse) => void;
    vi.mocked(authApi.register).mockImplementationOnce(() => new Promise((done) => { resolve = done; }));
    const { container } = renderRegister();
    fillForm();
    fireEvent.submit(container.querySelector("form")!);
    await waitFor(() => expect(authApi.register).toHaveBeenCalledTimes(1));
    expect(screen.getByRole("button", { name: new RegExp(LABELS.auth.CREATE_ACCOUNT) })).toBeDisabled();
    expect(screen.getByRole("button", { name: LABELS.auth.GOOGLE })).toBeDisabled();
    fireEvent.submit(container.querySelector("form")!);
    expect(authApi.register).toHaveBeenCalledTimes(1);
    resolve(authResponse);
    await screen.findByText("Trang chủ sau đăng ký");
  });

  it("registers with Google through the existing social auth API", async () => {
    vi.mocked(triggerGoogleLogin).mockResolvedValueOnce("google-access-token");
    vi.mocked(authApi.socialLogin).mockResolvedValueOnce(authResponse);
    renderRegister();
    fireEvent.click(screen.getByRole("button", { name: LABELS.auth.GOOGLE }));
    await screen.findByText("Trang chủ sau đăng ký");
    expect(authApi.socialLogin).toHaveBeenCalledWith({ provider: "GOOGLE", access_token: "google-access-token" });
    expect(authApi.register).not.toHaveBeenCalled();
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it("restores the form when the Google popup is cancelled", async () => {
    vi.mocked(triggerGoogleLogin).mockRejectedValueOnce(new Error("Google popup closed"));
    renderRegister();
    fireEvent.click(screen.getByRole("button", { name: LABELS.auth.GOOGLE }));
    await waitFor(() => expect(notify.error).toHaveBeenCalledWith("Google popup closed"));
    expect(screen.getByRole("button", { name: LABELS.auth.CREATE_ACCOUNT })).toBeEnabled();
    expect(authApi.socialLogin).not.toHaveBeenCalled();
  });
});

describe("registration input validation", () => {
  it.each(["abc0912345678", "091234567899", "0|12345678", "8412345678"])("rejects invalid phone %s", (phone_number) => {
    expect(registerSchema.safeParse({ full_name: "Nguyễn An", email: "an@example.com", phone_number, password: "MatKhau123", confirm_password: "MatKhau123" }).success).toBe(false);
  });

  it.each(["", "  ", "0912345678", "+84912345678", "84912345678"])("accepts optional or valid phone %s", (phone_number) => {
    expect(registerSchema.safeParse({ full_name: "Nguyễn An", email: "an@example.com", phone_number, password: "MatKhau123", confirm_password: "MatKhau123" }).success).toBe(true);
  });
});
