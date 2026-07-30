"use client";

import { Mail } from "lucide-react";
import { InputField } from "./forms/InputField";

interface ForgotPasswordScreenProps {
  email: string;
  success: boolean;
  isLoading: boolean;
  handleChange: (value: string) => void;
  handleSubmit: () => void;
  goBack: () => void;
}

export function ForgotPasswordScreen({
  email,
  success,
  isLoading,
  handleChange,
  handleSubmit,
  goBack,
}: ForgotPasswordScreenProps) {
  return (
    <div className="flex w-85 flex-col">
      <div className="flex items-center gap-1.5 pb-5">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#9fb3c8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
        <button
          type="button"
          onClick={goBack}
          className="text-xs text-mist hover:text-teal-bright"
        >
          Voltar
        </button>
      </div>

      <h2 className="pb-1 text-center font-heading text-[22px] text-white">
        <span className="font-bold">Recuperar</span> Senha
      </h2>
      <p className="mb-4 text-center text-xs text-mist">
        Digite seu email e enviaremos um link para redefinir sua senha.
      </p>

      {success ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-teal/30 bg-teal/10 px-6 py-8 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-teal/20">
            <Mail size={28} className="text-teal-bright" />
          </div>
          <p className="text-sm text-white">
            Link enviado! Verifique sua caixa de entrada.
          </p>
        </div>
      ) : (
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex flex-col gap-4.5"
        >
          <InputField
            label="Email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            icon={<Mail size={18} />}
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full bg-linear-to-b from-teal-bright to-teal py-3.5 font-heading text-sm font-semibold text-[#06251f] shadow-lg shadow-teal/30 transition-transform hover:-translate-y-0.5 hover:shadow-xl hover:shadow-teal/40 disabled:opacity-60"
          >
            {isLoading ? "Enviando..." : "Enviar link"}
          </button>
        </form>
      )}
    </div>
  );
}
