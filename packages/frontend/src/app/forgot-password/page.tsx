"use client";

import { useForgotPassword } from "@/hooks/auth/useForgotPassword";
import { ForgotPasswordScreen } from "@/components/auth/ForgotPasswordScreen";

export default function ForgotPasswordPage() {
  const forgot = useForgotPassword();

  return <ForgotPasswordScreen {...forgot} />;
}
