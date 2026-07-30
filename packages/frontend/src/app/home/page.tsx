"use client";

import { useAuth } from "@/contexts/useAuth";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex w-full max-w-md flex-1 flex-col items-center justify-center gap-8 px-6">
      <div className="flex flex-col items-center gap-2">
        <div className="flex size-20 items-center justify-center rounded-full bg-teal/20">
          <svg
            className="size-12 drop-shadow-[0_0_16px_rgba(210,245,235,0.4)]"
            viewBox="0 0 120 125"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g transform="translate(0,125) scale(0.1,-0.1)" fill="#22d3b8">
              <path d="M525 697 c-47 -47 -54 -92 -22 -159 26 -57 91 -138 110 -138 14 0 86 90 111 137 49 96 -10 193 -117 193 -42 0 -54 -5 -82 -33z m130 -57 c41 -45 -18 -110 -70 -76 -27 18 -34 63 -13 84 18 18 63 14 83 -8z" />
              <path d="M560 1055 c0 -42 3 -55 15 -55 10 0 15 10 15 33 l0 32 26 -32 c14 -18 30 -33 35 -33 5 0 9 25 9 55 0 30 -4 55 -10 55 -5 0 -10 -15 -10 -32 l0 -33 -26 33 c-39 49 -54 43 -54 -23z" />
            </g>
          </svg>
        </div>

        <h1 className="font-heading text-2xl text-white">
          Bem-vindo, <span className="font-bold">{user?.name ?? "Pescador"}</span>
        </h1>
        <p className="text-sm text-mist">{user?.email}</p>
      </div>

      <div className="flex w-full flex-col gap-3 rounded-2xl border border-white/10 bg-card p-5">
        <h2 className="text-xs font-medium uppercase tracking-wide text-mist">Informações</h2>
        <div className="flex justify-between text-sm">
          <span className="text-mist">Membro desde</span>
          <span className="text-white">
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString("pt-BR")
              : "-"}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-mist">Função</span>
          <span className="text-white">{user?.role ?? "-"}</span>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="w-full rounded-full border border-white/10 bg-white/5 py-3 font-heading text-sm font-medium text-mist transition-colors hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive-foreground"
      >
        Sair da conta
      </button>
    </div>
  );
}
