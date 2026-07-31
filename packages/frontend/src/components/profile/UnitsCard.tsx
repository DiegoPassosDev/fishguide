"use client";

import { Ruler } from "lucide-react";
import { useSettings, type WeightUnit, type TemperatureUnit } from "@/contexts/SettingsContext";

const weightOptions: { value: WeightUnit; label: string }[] = [
  { value: "kg", label: "Quilogramas" },
  { value: "lb", label: "Libras" },
];

const temperatureOptions: { value: TemperatureUnit; label: string }[] = [
  { value: "celsius", label: "°C" },
  { value: "fahrenheit", label: "°F" },
];

export function UnitsCard() {
  const { settings, update } = useSettings();

  return (
    <section className="mb-3 rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-lg leading-none">📏</span>
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Unidades
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Ruler size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Peso</p>
              <p className="text-xs text-muted-foreground">Unidade de massa dos registros</p>
            </div>
          </div>
          <div className="flex rounded-full border border-border bg-muted/50 p-0.5">
            {weightOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => update({ weightUnit: option.value })}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  settings.weightUnit === option.value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <span className="text-sm font-bold">°</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Temperatura</p>
              <p className="text-xs text-muted-foreground">Escala das condições do tempo</p>
            </div>
          </div>
          <div className="flex rounded-full border border-border bg-muted/50 p-0.5">
            {temperatureOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => update({ temperatureUnit: option.value })}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  settings.temperatureUnit === option.value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
