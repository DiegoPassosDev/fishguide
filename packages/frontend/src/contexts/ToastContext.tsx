"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = nextId++;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => removeToast(id), 4000);
    },
    [removeToast],
  );

  const iconMap: Record<ToastType, ReactNode> = {
    success: <CheckCircle size={18} className="text-green-300" />,
    error: <XCircle size={18} className="text-red-300" />,
    info: <Info size={18} className="text-teal-bright" />,
  };

  const bgMap: Record<ToastType, string> = {
    success: "bg-green-800/90 border-green-600",
    error: "bg-red-800/90 border-red-600",
    info: "bg-navy-mid/90 border-teal/50",
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex flex-col items-center gap-2 p-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex w-full max-w-sm items-center rounded-xl border px-4 py-3 shadow-lg backdrop-blur-md transition-all duration-300 ${
              bgMap[toast.type]
            }`}
            style={{
              animation: "slideDown 0.3s ease-out",
            }}
          >
            <div className="flex flex-1 items-center justify-center gap-2">
              <span className="shrink-0">{iconMap[toast.type]}</span>
              <p className="text-center text-sm text-white">{toast.message}</p>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="ml-2 shrink-0 opacity-60 hover:opacity-100"
            >
              <X size={16} className="text-white/70" />
            </button>
          </div>
        ))}
      </div>

    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
