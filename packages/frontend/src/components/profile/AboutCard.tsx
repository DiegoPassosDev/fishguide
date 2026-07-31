"use client";

import { Logo } from "@/components/layout/Logo";

export function AboutCard() {
  return (
    <section className="mb-3 rounded-3xl border border-border bg-card p-5 text-center shadow-sm">
      <div className="flex justify-center">
        <Logo />
      </div>
      <p className="mt-3 text-sm font-semibold text-foreground">Versão 1.0.0</p>
      <p className="mx-auto mt-1 max-w-55 text-xs leading-relaxed text-muted-foreground">
        Seu guia inteligente de pesca. Registre capturas, acompanhe condições e vire um mestre
        das marés.
      </p>
    </section>
  );
}
