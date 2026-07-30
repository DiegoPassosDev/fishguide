"use client";

import { useLogin } from "@/hooks/auth/useLogin";
import { LoginScreen } from "@/components/auth/LoginScreen";

export default function LoginPage() {
  const login = useLogin();

  return (
    <div className="flex flex-1 flex-col items-center">
      <LoginScreen {...login} />
    </div>
  );
}
