"use client";

import { CloudOff, RefreshCw } from "lucide-react";

interface CardErrorProps {
  onRetry?: () => void;
}

export function CardError({ onRetry }: CardErrorProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-8">
      <CloudOff size={28} className="text-muted-foreground" />
      <p className="text-xs font-semibold text-muted-foreground">
        Não foi possível carregar os dados
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <RefreshCw size={12} />
          Tentar novamente
        </button>
      )}
    </div>
  );
}
