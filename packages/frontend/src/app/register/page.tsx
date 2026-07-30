"use client";

import { useRegister } from "@/hooks/auth/useRegister";
import { RegisterScreen } from "@/components/auth/RegisterScreen";

export default function RegisterPage() {
  const register = useRegister();

  return <RegisterScreen {...register} />;
}
