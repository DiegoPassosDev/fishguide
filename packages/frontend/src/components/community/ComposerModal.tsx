"use client";

import { useRef, useState } from "react";
import { Camera, Fish, Images, LocateFixed, Send, X } from "lucide-react";
import type { ChangeEvent } from "react";
import { useToast } from "@/contexts/ToastContext";
import type { PostCatch } from "./types";

interface ComposerModalProps {
  topics: string[];
  onClose: () => void;
  onPublish: (draft: {
    topic: string;
    content: string;
    catch?: PostCatch;
    photoUrl?: string;
  }) => void;
}

const inputClass =
  "w-full rounded-xl border border-input bg-muted/50 px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary";

export function ComposerModal({ topics, onClose, onPublish }: ComposerModalProps) {
  const { showToast } = useToast();
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [includeCatch, setIncludeCatch] = useState(false);
  const [species, setSpecies] = useState("");
  const [weight, setWeight] = useState("");
  const [location, setLocation] = useState("");
  const [tide, setTide] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string>();
  const [locating, setLocating] = useState(false);
  const cameraInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);

  function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setPhotoUrl(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function locate() {
    if (!("geolocation" in navigator)) {
      showToast("Seu navegador não suporta localização.", "error");
      return;
    }
    if (!window.isSecureContext) {
      showToast("Localização só funciona em HTTPS ou localhost.", "error");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const fallback = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&accept-language=pt`,
          );
          const data = await res.json();
          const addr = data.address as Record<string, string> | undefined;
          const road = addr?.road ?? addr?.pedestrian ?? addr?.footway ?? addr?.square ?? addr?.path;
          const suburb = addr?.suburb;
          const city = addr?.city_district ?? addr?.city ?? addr?.town;
          const state = addr?.state;
          const addressText = [road, suburb, city, state].filter(Boolean).join(", ");
          setLocation(addressText ? `${addressText} (${fallback})` : fallback);
        } catch {
          setLocation(fallback);
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          showToast("Permissão de localização negada. Permita o acesso e tente de novo.", "error");
        } else if (err.code === err.TIMEOUT) {
          showToast("A localização demorou demais. Tente novamente.", "error");
        } else {
          showToast("Não foi possível obter sua localização agora.", "error");
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    );
  }

  function handlePublish() {
    const subject = topic.trim();
    const text = content.trim();
    if (!subject) {
      showToast("Informe o assunto da publicação.", "error");
      return;
    }
    if (!text) {
      showToast("Escreva algo para publicar.", "error");
      return;
    }
    onPublish({
      topic: subject,
      content: text,
      photoUrl,
      catch:
        includeCatch && species.trim()
          ? {
              species: species.trim(),
              weight: weight.trim() || "-",
              location: location.trim() || "-",
              tide: tide.trim() || "-",
            }
          : undefined,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center">
      <div className="flex max-h-[90dvh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-border bg-background shadow-2xl sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-heading text-base font-bold text-foreground">Nova publicação</h2>
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
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Assunto
            </span>
            <input
              list="community-topics"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex.: Robalo, Dicas, Equipamentos..."
              className={inputClass}
            />
            <datalist id="community-topics">
              {topics.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Texto
            </span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="O que você quer compartilhar?"
              className={`${inputClass} min-h-24 resize-none`}
            />
          </label>

          <div>
            <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Foto
            </span>
            {photoUrl ? (
              <div className="relative overflow-hidden rounded-2xl border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoUrl} alt="Foto selecionada" className="h-44 w-full object-cover" />
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
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => cameraInput.current?.click()}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-muted/40 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted/70"
                >
                  <Camera size={16} className="text-primary" />
                  Tirar foto
                </button>
                <button
                  type="button"
                  onClick={() => galleryInput.current?.click()}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-muted/40 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted/70"
                >
                  <Images size={16} className="text-primary" />
                  Galeria
                </button>
              </div>
            )}
            <input
              ref={cameraInput}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handlePhotoChange}
            />
            <input
              ref={galleryInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>

          <label className="flex items-center justify-between rounded-2xl border border-border bg-muted/40 px-4 py-3">
            <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Fish size={16} className="text-primary" />
              Incluir captura
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={includeCatch}
              onClick={() => setIncludeCatch((v) => !v)}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                includeCatch ? "bg-primary" : "bg-border"
              }`}
            >
              <span
                className={`absolute top-1/2 size-5 -translate-y-1/2 rounded-full bg-white shadow transition-[left] duration-200 ${
                  includeCatch ? "left-5" : "left-0.5"
                }`}
              />
            </button>
          </label>

          {includeCatch && (
            <div className="grid grid-cols-2 gap-3">
              <label className="col-span-2 flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Espécie
                </span>
                <input
                  className={inputClass}
                  value={species}
                  onChange={(e) => setSpecies(e.target.value)}
                  placeholder="Ex.: Robalo"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Peso
                </span>
                <input
                  className={inputClass}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Ex.: 4,2 kg"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Maré
                </span>
                <input
                  className={inputClass}
                  value={tide}
                  onChange={(e) => setTide(e.target.value)}
                  placeholder="Ex.: Enchendo"
                />
              </label>
              <label className="col-span-2 flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Local
                </span>
                <div className="relative">
                  <input
                    className={`${inputClass} pr-11`}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Onde foi a captura?"
                  />
                  <button
                    type="button"
                    onClick={locate}
                    disabled={locating}
                    className="absolute right-1.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-primary disabled:opacity-50"
                    aria-label="Usar minha localização atual"
                    title="Usar minha localização atual"
                  >
                    <LocateFixed size={16} className={locating ? "animate-pulse text-primary" : ""} />
                  </button>
                </div>
              </label>
            </div>
          )}
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
            onClick={handlePublish}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Send size={16} />
            Publicar
          </button>
        </div>
      </div>
    </div>
  );
}
