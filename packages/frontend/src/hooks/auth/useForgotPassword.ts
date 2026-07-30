"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as authApi from "@/lib/auth.api";
import { useToast } from "@/contexts/ToastContext";

export function useForgotPassword() {
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (value: string) => {
    setEmail(value);
  };

  const handleSubmit = async () => {
    if (!email) {
      showToast("Informe seu email.", "error");
      return;
    }

    setIsLoading(true);

    try {
      await authApi.forgotPassword({ email });
      setSuccess(true);
      showToast("Link enviado! Verifique seu email.", "success");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        showToast(axiosErr.response?.data?.message ?? "Erro ao enviar link.", "error");
      } else {
        showToast("Erro ao enviar link.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => router.back();

  return {
    email,
    success,
    isLoading,
    handleChange,
    handleSubmit,
    goBack,
  };
}
