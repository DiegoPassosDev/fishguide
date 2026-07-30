"use client";

import { useRegister } from "@/hooks/auth/useRegister";
import { RegisterScreen } from "@/components/auth/RegisterScreen";

export default function RegisterPage() {
  const register = useRegister();

  return (
    <div className="flex flex-1 flex-col items-center">
      <RegisterScreen {...register} />
    </div>
  );
}
