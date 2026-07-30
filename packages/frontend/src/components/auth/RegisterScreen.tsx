"use client";

import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { InputField } from "./forms/InputField";

interface RegisterScreenProps {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  isLoading: boolean;
  handleChange: (field: "name" | "email" | "password" | "confirmPassword", value: string) => void;
  handleSubmit: () => void;
  goToLogin: () => void;
}

export function RegisterScreen({
  name,
  email,
  password,
  confirmPassword,
  isLoading,
  handleChange,
  handleSubmit,
  goToLogin,
}: RegisterScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="flex w-[340px] flex-1 flex-col justify-start py-12">
      <div className="flex flex-col items-center gap-1">
        <div className="flex size-28 items-center justify-center">
          <svg
            className="size-24 drop-shadow-[0_0_20px_rgba(210,245,235,0.4)]"
            viewBox="0 0 120 125"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g transform="translate(0,125) scale(0.1,-0.1)" fill="#ffffff">
              <path d="M560 1055 c0 -42 3 -55 15 -55 10 0 15 10 15 33 l0 32 26 -32 c14 -18 30 -33 35 -33 5 0 9 25 9 55 0 30 -4 55 -10 55 -5 0 -10 -15 -10 -32 l0 -33 -26 33 c-39 49 -54 43 -54 -23z" />
              <path d="M606 972 c-14 -23 -83 -202 -77 -202 3 0 24 7 47 16 37 14 44 14 79 0 21 -9 40 -15 42 -13 3 4 -73 197 -81 204 -2 3 -7 0 -10 -5z" />
              <path d="M488 866 c-122 -43 -214 -141 -253 -270 -10 -34 -18 -42 -61 -58 -27 -11 -53 -23 -57 -27 -5 -5 16 -18 47 -30 52 -22 55 -25 66 -72 12 -49 22 -57 50 -40 11 7 14 33 15 108 0 79 4 107 22 145 28 61 102 140 151 162 28 13 42 27 51 52 7 20 11 37 9 39 -1 2 -19 -2 -40 -9z" />
              <path d="M690 874 c0 -3 6 -20 14 -39 10 -24 28 -41 64 -59 87 -44 146 -131 163 -240 8 -46 17 -68 39 -91 24 -24 30 -26 30 -12 0 13 20 27 63 47 59 27 61 29 37 38 -94 36 -96 38 -110 87 -28 99 -125 210 -216 246 -44 17 -84 28 -84 23z" />
              <path d="M525 697 c-47 -47 -54 -92 -22 -159 26 -57 91 -138 110 -138 14 0 86 90 111 137 49 96 -10 193 -117 193 -42 0 -54 -5 -82 -33z m130 -57 c41 -45 -18 -110 -70 -76 -27 18 -34 63 -13 84 18 18 63 14 83 -8z" />
              <path d="M754 481 c-38 -10 -67 -29 -95 -65 -33 -42 -12 -52 46 -22 32 18 64 26 96 26 46 0 99 -16 99 -30 0 -13 -46 -49 -82 -65 -71 -29 -126 -13 -241 69 -95 68 -178 77 -233 25 -13 -12 -23 -24 -21 -25 2 -2 20 1 40 7 54 15 99 -2 195 -70 45 -33 98 -65 118 -71 36 -12 120 -9 159 5 11 4 4 -4 -15 -17 -27 -18 -48 -23 -95 -23 -69 1 -96 13 -204 91 -64 47 -80 54 -120 54 -25 0 -66 -9 -90 -20 -52 -24 -101 -25 -142 -4 -29 14 -30 14 -21 -3 36 -66 100 -85 181 -53 68 27 94 21 168 -37 76 -58 106 -74 173 -89 l55 -12 -47 -1 c-59 -1 -139 15 -200 41 -55 23 -59 33 -20 46 l27 9 -33 17 c-36 19 -87 16 -130 -8 -24 -13 -24 -13 27 -58 157 -141 380 -140 535 2 44 41 106 146 106 181 0 27 -65 77 -122 94 -56 16 -67 17 -114 6z" />
              <path d="M810 385 c0 -8 7 -15 15 -15 8 0 15 7 15 15 0 8 -7 15 -15 15 -8 0 -15 -7 -15 -15z" />
            </g>
          </svg>
        </div>

        <h2 className="text-center font-heading text-[22px] text-white">
          <span className="font-bold">Fish</span>
          <span className="font-normal">Guide</span>
        </h2>
      </div>

      <div className="mt-4" />

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex flex-col gap-3"
      >
        <InputField
          label="Nome"
          placeholder="Seu nome completo"
          value={name}
          icon={<User size={16} />}
          onChange={(v) => handleChange("name", v)}
        />

        <InputField
          label="Email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          icon={<Mail size={16} />}
          onChange={(v) => handleChange("email", v)}
        />

        <InputField
          label="Senha"
          type={showPassword ? "text" : "password"}
          placeholder="Mínimo 8 caracteres"
          value={password}
          icon={<Lock size={16} />}
          rightIcon={showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          onRightIconClick={() => setShowPassword(!showPassword)}
          onChange={(v) => handleChange("password", v)}
        />

        <InputField
          label="Confirmar Senha"
          type={showConfirm ? "text" : "password"}
          placeholder="Repita a senha"
          value={confirmPassword}
          icon={<Lock size={16} />}
          rightIcon={showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          onRightIconClick={() => setShowConfirm(!showConfirm)}
          onChange={(v) => handleChange("confirmPassword", v)}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full rounded-full bg-gradient-to-b from-teal-bright to-teal py-3.5 font-heading text-sm font-semibold text-[#06251f] shadow-lg shadow-teal/30 transition-transform hover:-translate-y-0.5 hover:shadow-xl hover:shadow-teal/40 disabled:opacity-60"
        >
          {isLoading ? "Criando..." : "Criar Conta"}
        </button>

        <p className="text-center text-[11px] leading-relaxed text-mist">
          Ao criar uma conta, você aceita nossos{" "}
          <a href="#" className="font-medium text-teal-bright underline">
            Termos de Uso
          </a>{" "}
          e{" "}
          <a href="#" className="font-medium text-teal-bright underline">
            Política de Privacidade
          </a>
          .
        </p>
      </form>

      <div className="flex-1" />

      <p className="text-center text-xs text-mist">
        Já tem conta?{" "}
        <button
          type="button"
          onClick={goToLogin}
          className="font-medium text-teal-bright hover:underline"
        >
          Faça login
        </button>
      </p>
    </div>
  );
}
