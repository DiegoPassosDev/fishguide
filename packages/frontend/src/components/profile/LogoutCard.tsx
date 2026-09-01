"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/useAuth";

export function LogoutCard() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <section className="mb-3 rounded-3xl border border-border bg-card p-3 shadow-sm">
      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-destructive/10"
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
          <LogOut size={16} />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <p className="text-sm font-semibold text-destructive">Sair da conta</p>
          <p className="text-xs text-muted-foreground">Encerrar sessão neste dispositivo</p>
        </div>
      </button>
    </section>
  );
}
