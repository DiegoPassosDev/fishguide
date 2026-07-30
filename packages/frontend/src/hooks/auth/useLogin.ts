"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/useAuth";
import { useToast } from "@/contexts/ToastContext";

export function useLogin() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: "email" | "password", value: string) => {
    if (field === "email") setEmail(value);
    else setPassword(value);
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      showToast("Preencha todos os campos.", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast("E-mail inválido.", "error");
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      router.push("/home");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { status?: number; data?: { message?: string | string[] } } };
        const message = axiosErr.response?.data?.message;
        const status = axiosErr.response?.status;

        if (status === 500) {
          showToast("Erro no servidor. Tente novamente.", "error");
        } else if (Array.isArray(message)) {
          showToast(message[0] ?? "Erro ao fazer login.", "error");
        } else if (typeof message === "string") {
          showToast(message, "error");
        } else {
          showToast("Erro ao fazer login.", "error");
        }
      } else {
        showToast("Erro ao fazer login.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const goToForgotPassword = () => router.push("/forgot-password");
  const goToRegister = () => router.push("/register");

  return {
    email,
    password,
    isLoading,
    handleChange,
    handleSubmit,
    goToForgotPassword,
    goToRegister,
  };
}
