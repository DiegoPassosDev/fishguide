"use client";

import { useState } from "react";
import { ShieldCheck, ChevronRight } from "lucide-react";
import { ChangePasswordModal } from "./ChangePasswordModal";

export function SecurityCard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section className="mb-3 rounded-3xl border border-border bg-card p-3 shadow-sm">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-colors hover:bg-muted/50"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">Segurança</p>
            <p className="text-xs text-muted-foreground">Alterar minha senha</p>
          </div>
          <ChevronRight size={18} className="text-muted-foreground" />
        </button>
      </section>

      {isOpen && <ChangePasswordModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
