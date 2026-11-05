import { AuthLayout } from "../components/AuthLayout";
import { RegisterForm } from "../components/RegisterForm";

export function RegisterPage() {
  return <AuthLayout headingId="register-heading"><RegisterForm /></AuthLayout>;
}
