import { createRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AxiosError, AxiosHeaders } from "axios";
import { ButtonCommon } from "@/components/common/ButtonCommon";
import { TextFieldCommon } from "@/components/common/TextFieldCommon";
import { SelectCommon } from "@/components/common/SelectCommon";
import { FormCommon } from "@/components/common/FormCommon";
import { LinkCommon } from "@/components/common/LinkCommon";
import { LABELS } from "@/constants/labels";
import { MESSAGES, VALIDATION_MESSAGES } from "@/constants/messages";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { authApi } from "@/features/auth/api/authApi";
import { notify } from "@/services/notifications";

vi.mock("@/services/notifications", () => ({
  notify: { success: vi.fn(), error: vi.fn(), info: vi.fn(), dismiss: vi.fn() },
}));
// Icon rendering is outside these interaction tests; skip the large icon barrel.
vi.mock("lucide-react", () => ({
  Sprout: () => null,
  X: () => null,
  AlertCircle: () => null,
  RotateCcw: () => null,
  PackageOpen: () => null,
}));
vi.mock("@/features/auth/api/authApi", () => ({
  authApi: { login: vi.fn(), register: vi.fn() },
}));

beforeEach(() => vi.clearAllMocks());
afterEach(cleanup);

describe("shared form controls", () => {
  it("does not accidentally submit when a plain button is clicked", () => {
    const onSubmit = vi.fn((event) => event.preventDefault());
    render(
      <FormCommon onSubmit={onSubmit}>
        <ButtonCommon>{LABELS.common.RESET}</ButtonCommon>
        <ButtonCommon type="submit">{LABELS.navigation.LOGIN}</ButtonCommon>
      </FormCommon>,
    );
    fireEvent.click(screen.getByRole("button", { name: LABELS.common.RESET }));
    expect(onSubmit).not.toHaveBeenCalled();
    fireEvent.click(
      screen.getByRole("button", { name: LABELS.navigation.LOGIN }),
    );
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("blocks repeated actions while loading", () => {
    const onClick = vi.fn();
    render(
      <ButtonCommon isLoading onClick={onClick}>
        {LABELS.navigation.LOGIN}
      </ButtonCommon>,
    );
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("gives repeated labels unique IDs and associates errors and help with the correct field", () => {
    const ref = createRef<HTMLInputElement>();
    const { rerender } = render(
      <>
        <TextFieldCommon
          ref={ref}
          label={LABELS.auth.EMAIL}
          error={VALIDATION_MESSAGES.EMAIL_INVALID}
          helperText={LABELS.auth.EMAIL_PLACEHOLDER}
        />
        <TextFieldCommon label={LABELS.auth.EMAIL} />
      </>,
    );
    const inputs = screen.getAllByLabelText(LABELS.auth.EMAIL);
    expect(inputs[0].id).not.toBe(inputs[1].id);
    expect(ref.current).toBe(inputs[0]);
    expect(inputs[0]).toHaveAccessibleDescription(
      VALIDATION_MESSAGES.EMAIL_INVALID,
    );
    expect(inputs[0]).toHaveAttribute("aria-invalid", "true");
    rerender(
      <>
        <TextFieldCommon
          ref={ref}
          label={LABELS.auth.EMAIL}
          helperText={LABELS.auth.EMAIL_PLACEHOLDER}
        />
        <TextFieldCommon label={LABELS.auth.EMAIL} />
      </>,
    );
    expect(
      screen.getAllByLabelText(LABELS.auth.EMAIL)[0],
    ).toHaveAccessibleDescription(LABELS.auth.EMAIL_PLACEHOLDER);
  });

  it("keeps select labels accessible and forwards changed values", () => {
    const onChange = vi.fn();
    render(
      <SelectCommon
        label={LABELS.catalog.CARE_LEVEL}
        onChange={onChange}
        options={[
          { value: "", label: LABELS.catalog.ALL_CARE_LEVELS },
          { value: "EASY", label: LABELS.catalog.EASY_CARE },
        ]}
      />,
    );
    fireEvent.change(
      screen.getByRole("combobox", { name: LABELS.catalog.CARE_LEVEL }),
      { target: { value: "EASY" } },
    );
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("combobox")).toHaveValue("EASY");
  });

  it("focuses the first invalid field and emits only one validation toast", () => {
    render(
      <FormCommon>
        <TextFieldCommon label={LABELS.auth.EMAIL} type="email" required />
        <TextFieldCommon label={LABELS.auth.PASSWORD} required />
      </FormCommon>,
    );
    const email = screen.getByLabelText(LABELS.auth.EMAIL);
    fireEvent.invalid(email);
    fireEvent.invalid(screen.getByLabelText(LABELS.auth.PASSWORD));
    expect(email).toHaveFocus();
    expect(notify.error).toHaveBeenCalledTimes(1);
    expect(notify.error).toHaveBeenCalledWith(
      VALIDATION_MESSAGES.REQUIRED(LABELS.auth.EMAIL),
      expect.any(Object),
    );
  });

  it("prevents a second form submission while submitting", () => {
    const onSubmit = vi.fn();
    const { container } = render(
      <FormCommon isSubmitting onSubmit={onSubmit}>
        <ButtonCommon type="submit">{LABELS.navigation.LOGIN}</ButtonCommon>
      </FormCommon>,
    );
    fireEvent.submit(container.querySelector("form")!);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("uses a real link for navigation without nesting a button", () => {
    render(
      <MemoryRouter>
        <LinkCommon to="/catalog" variant="primary">
          {LABELS.footer.ALL_PLANTS}
        </LinkCommon>
      </MemoryRouter>,
    );
    expect(screen.getByRole("link")).toHaveAttribute("href", "/catalog");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

describe("login form after migration", () => {
  function renderLogin() {
    return render(
      <QueryProvider>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </QueryProvider>,
    );
  }

  it("validates registered fields and toasts the validation error before calling the API", async () => {
    const { container } = renderLogin();
    fireEvent.submit(container.querySelector("form")!);
    await screen.findByText(VALIDATION_MESSAGES.EMAIL_REQUIRED);
    expect(authApi.login).not.toHaveBeenCalled();
    expect(notify.error).toHaveBeenCalledWith(
      VALIDATION_MESSAGES.EMAIL_REQUIRED,
      { id: "form-validation" },
    );
  });

  it("forwards form values to the existing auth API and displays failed login as one toast", async () => {
    const error = new AxiosError("Unauthorized");
    error.response = {
      status: 401,
      statusText: "Unauthorized",
      data: {},
      headers: {},
      config: { headers: new AxiosHeaders() },
    };
    vi.mocked(authApi.login).mockRejectedValueOnce(error);
    const { container } = renderLogin();
    fireEvent.change(screen.getByLabelText(LABELS.auth.EMAIL), {
      target: { value: "test@example.test" },
    });
    fireEvent.change(screen.getByLabelText(LABELS.auth.PASSWORD), {
      target: { value: "test-password" },
    });
    fireEvent.submit(container.querySelector("form")!);
    await waitFor(() =>
      expect(authApi.login).toHaveBeenCalledWith({
        email: "test@example.test",
        password: "test-password",
      }),
    );
    await waitFor(() =>
      expect(notify.error).toHaveBeenCalledWith(MESSAGES.LOGIN_ERROR),
    );
    expect(notify.error).toHaveBeenCalledTimes(1);
  });
});
