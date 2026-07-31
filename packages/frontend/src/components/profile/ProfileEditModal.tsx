"use client";

import { useState } from "react";
import { X, Save, Globe, UsersRound, Lock } from "lucide-react";
import type { UpdateProfileDto, User } from "@/types/auth";
import { useAuth } from "@/contexts/useAuth";
import { useToast } from "@/contexts/ToastContext";

interface ProfileEditModalProps {
  user: User;
  onClose: () => void;
}

const privacyOptions = [
  { value: "public", label: "Público", description: "Visível para todos", icon: Globe },
  { value: "friends", label: "Amigos", description: "Visível para amigos", icon: UsersRound },
  { value: "private", label: "Privado", description: "Somente você", icon: Lock },
];

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-input bg-muted/50 px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary";

export function ProfileEditModal({ user, onClose }: ProfileEditModalProps) {
  const { updateUser } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState<UpdateProfileDto>(() => ({
    name: user.name,
    phone: user.phone ?? "",
    city: user.city ?? "",
    state: user.state ?? "",
    country: user.country ?? "",
    bio: user.bio ?? "",
    privacy: user.privacy ?? "public",
  }));
  const [isSaving, setIsSaving] = useState(false);

  const set = (field: keyof UpdateProfileDto, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    const payload: UpdateProfileDto = {
      name: form.name?.trim(),
      phone: form.phone?.trim() || undefined,
      city: form.city?.trim() || undefined,
      state: form.state?.trim() || undefined,
      country: form.country?.trim() || undefined,
      bio: form.bio?.trim() || undefined,
      privacy: form.privacy ?? "public",
    };

    if (!payload.name) {
      showToast("O nome é obrigatório.", "error");
      return;
    }

    setIsSaving(true);
    try {
      await updateUser(payload);
      showToast("Perfil atualizado com sucesso!", "success");
      onClose();
    } catch {
      showToast("Erro ao salvar o perfil. Tente novamente.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center">
      <div className="flex max-h-[90dvh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-border bg-background shadow-2xl sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-heading text-base font-bold text-foreground">Editar Perfil</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto px-5 py-4">
          <Field label="Nome">
            <input
              className={inputClass}
              value={form.name ?? ""}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Seu nome"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Cidade">
              <input
                className={inputClass}
                value={form.city ?? ""}
                onChange={(e) => set("city", e.target.value)}
                placeholder="Cidade"
              />
            </Field>
            <Field label="Estado">
              <input
                className={inputClass}
                value={form.state ?? ""}
                onChange={(e) => set("state", e.target.value)}
                placeholder="UF"
              />
            </Field>
          </div>

          <Field label="País">
            <input
              className={inputClass}
              value={form.country ?? ""}
              onChange={(e) => set("country", e.target.value)}
              placeholder="País"
            />
          </Field>

          <Field label="Telefone">
            <input
              className={inputClass}
              value={form.phone ?? ""}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="(00) 00000-0000"
            />
          </Field>

          <Field label="Biografia">
            <textarea
              className={`${inputClass} min-h-20 resize-none`}
              value={form.bio ?? ""}
              onChange={(e) => set("bio", e.target.value)}
              placeholder="Conte um pouco sobre você como pescador..."
            />
          </Field>

          <div>
            <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Privacidade do perfil
            </span>
            <div className="flex flex-col gap-2">
              {privacyOptions.map((option) => {
                const Icon = option.icon;
                const active = form.privacy === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => set("privacy", option.value)}
                    className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors ${
                      active
                        ? "border-primary bg-primary/10"
                        : "border-border bg-muted/40 hover:bg-muted/70"
                    }`}
                  >
                    <div
                      className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${
                        active ? "bg-primary text-primary-foreground" : "bg-border/40 text-muted-foreground"
                      }`}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground">{option.label}</p>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </div>
                    <span
                      className={`flex size-4 shrink-0 items-center justify-center rounded-full border ${
                        active ? "border-primary bg-primary" : "border-border"
                      }`}
                    >
                      {active && <span className="size-1.5 rounded-full bg-primary-foreground" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex gap-3 border-t border-border px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border border-border bg-background py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            <Save size={16} />
            {isSaving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
