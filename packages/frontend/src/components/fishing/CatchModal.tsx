"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Images, X } from "lucide-react";
import type { ChangeEvent } from "react";
import { useToast } from "@/contexts/ToastContext";
import type { Catch } from "./types";
import { getSpecies } from "@/lib/fishing-trips.api";

interface CatchModalProps {
  editing?: Catch;
  onClose: () => void;
  onSave: (draft: { species: string; speciesId: string; weight: string; length: string; notes: string; photoUrl?: string }) => void;
}

const inputClass =
  "w-full rounded-xl border border-input bg-muted/50 px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary";

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

export function CatchModal({ editing, onClose, onSave }: CatchModalProps) {
  const { showToast } = useToast();
  const [species, setSpecies] = useState(editing?.species ?? "");
  const [speciesId, setSpeciesId] = useState(editing?.speciesId ?? "");
  const [weight, setWeight] = useState(editing?.weight ?? "");
  const [length, setLength] = useState(editing?.length ?? "");
  const [notes, setNotes] = useState(editing?.notes ?? "");
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(editing?.photoUrl);
  const [speciesList, setSpeciesList] = useState<Array<{ id: string; name: string }>>([]);
  const galleryInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getSpecies()
      .then((list) => setSpeciesList(list))
      .catch(() => {});
  }, []);

  function handleSpeciesChange(value: string) {
    setSpecies(value);
    const match = speciesList.find((s) => s.name.toLowerCase() === value.toLowerCase());
    setSpeciesId(match?.id ?? "");
  }

  function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 800;
      let w = img.width;
      let h = img.height;
      if (w > MAX || h > MAX) {
        if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
        else { w = Math.round(w * MAX / h); h = MAX; }
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      setPhotoUrl(canvas.toDataURL("image/jpeg", 0.7));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  function handleSave() {
    const subject = species.trim();
    if (!subject) {
      showToast("Informe a espécie capturada.", "error");
      return;
    }
    if (!speciesId) {
      showToast("Selecione uma espécie da lista.", "error");
      return;
    }
    onSave({
      species: subject,
      speciesId,
      weight: weight.trim(),
      length: length.trim(),
      notes: notes.trim(),
      photoUrl,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center">
      <div className="flex max-h-[90dvh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-border bg-background shadow-2xl sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-heading text-base font-bold text-foreground">
            {editing ? "Editar captura" : "Registrar captura"}
          </h2>
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
          <Field label="Espécie">
            <input
              list="fishing-species"
              value={species}
              onChange={(e) => handleSpeciesChange(e.target.value)}
              placeholder="Ex.: Robalo"
              className={inputClass}
            />
            <datalist id="fishing-species">
              {speciesList.map((s) => (
                <option key={s.id} value={s.name} />
              ))}
            </datalist>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Peso">
              <input
                className={inputClass}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Ex.: 4,2 kg"
              />
            </Field>
            <Field label="Comprimento">
              <input
                className={inputClass}
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="Ex.: 72 cm"
              />
            </Field>
          </div>

          <Field label="Observações">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Isca usada, hora do lance, sensações..."
              className={`${inputClass} min-h-20 resize-none`}
            />
          </Field>

          <div>
            <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Foto
            </span>
            {photoUrl ? (
              <div className="relative overflow-hidden rounded-2xl border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoUrl} alt="Foto da captura" className="h-40 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotoUrl(undefined)}
                  className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-black/60 text-white transition-opacity hover:opacity-80"
                  aria-label="Remover foto"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => galleryInput.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/30 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted/60"
              >
                <Images size={16} className="text-primary" />
                Adicionar foto
              </button>
            )}
            <input
              ref={galleryInput}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handlePhotoChange}
            />
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
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Camera size={16} />
            {editing ? "Salvar" : "Adicionar"}
          </button>
        </div>
      </div>
    </div>
  );
}
