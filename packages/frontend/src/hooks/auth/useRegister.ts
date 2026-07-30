"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/useAuth";
import { useToast } from "@/contexts/ToastContext";

export function useRegister() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: "name" | "email" | "password" | "confirmPassword", value: string) => {
    if (field === "name") setName(value);
    else if (field === "email") setEmail(value);
    else if (field === "password") setPassword(value);
    else setConfirmPassword(value);
  };

  const handleSubmit = async () => {
    if (!name || !email || !password || !confirmPassword) {
      showToast("Preencha todos os campos.", "error");
      return;
    }

    if (password !== confirmPassword) {
      showToast("As senhas não conferem.", "error");
      return;
    }

    if (password.length < 8) {
      showToast("A senha deve ter no mínimo 8 caracteres.", "error");
      return;
    }

    setIsLoading(true);

    try {
      await registerUser(name, email, password);
      showToast("Conta criada com sucesso!", "success");
      router.push("/login");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        showToast(axiosErr.response?.data?.message ?? "Erro ao criar conta.", "error");
      } else {
        showToast("Erro ao criar conta.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const goToLogin = () => router.push("/login");

  return {
    name,
    email,
    password,
    confirmPassword,
    isLoading,
    handleChange,
    handleSubmit,
    goToLogin,
  };
}
