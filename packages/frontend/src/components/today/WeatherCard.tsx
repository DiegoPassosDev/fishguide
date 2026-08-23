"use client";

import { Sun, CloudSun, Cloud, CloudRain, CloudLightning, CloudDrizzle, CloudFog, Wind, Gauge, Droplets, Snowflake } from "lucide-react";

import type { ComponentType } from "react";
import type { WeatherData } from "@/lib/weather.api";
import { CardError } from "./CardError";

const WEATHER_ICON: Record<string, { icon: ComponentType<{ size?: number; className?: string }>; color: string }> = {
  "01": { icon: Sun, color: "text-amber-400" },
  "02": { icon: CloudSun, color: "text-sky-400" },
  "03": { icon: Cloud, color: "text-gray-400" },
  "04": { icon: Cloud, color: "text-gray-400" },
  "09": { icon: CloudDrizzle, color: "text-blue-300" },
  "10": { icon: CloudRain, color: "text-blue-400" },
  "11": { icon: CloudLightning, color: "text-violet-400" },
  "13": { icon: Snowflake, color: "text-cyan-300" },
  "50": { icon: CloudFog, color: "text-gray-300" },
};

function WeatherSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-4 flex items-center gap-5">
        <div className="size-12 shrink-0 rounded-full bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-7 w-24 rounded bg-muted" />
          <div className="h-3 w-20 rounded bg-muted" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-11 rounded-xl bg-muted/60" />
        ))}
      </div>
    </div>
  );
}

interface WeatherCardProps {
  data: WeatherData | null;
  error?: boolean;
  onRetry?: () => void;
}

export function WeatherCard({ data, error, onRetry }: WeatherCardProps) {
  return (
    <section className="mb-3 rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-lg leading-none">🌤</span>
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Clima
        </h2>
      </div>

      {error && !data ? (
        <CardError onRetry={onRetry} />
      ) : !data ? (
        <WeatherSkeleton />
      ) : (
        <WeatherContent data={data} />
      )}
    </section>
  );
}

function WeatherContent({ data }: { data: WeatherData }) {
  const iconConfig = WEATHER_ICON[data.conditionIcon?.slice(0, 2)] ?? WEATHER_ICON["02"];
  const WeatherIcon = iconConfig.icon;

  const items = [
    { icon: <Wind size={14} className="text-sky-400" />, label: "Vento", value: `${data.vento} km/h` },
    { icon: <Gauge size={14} className="text-violet-400" />, label: "Pressão", value: `${data.pressao} hPa` },
    { icon: <Droplets size={14} className="text-blue-400" />, label: "Umidade", value: `${data.umidade}%` },
    { icon: <CloudRain size={14} className="text-cyan-400" />, label: "Chuva (1h)", value: `${data.chuva.toFixed(2).replace(".", ",")} mm` },
  ];

  return (
    <>
      <div className="mb-4 flex items-center gap-5">
        <WeatherIcon size={48} className={`${iconConfig.color} shrink-0`} />
        <div>
          <div className="flex items-baseline gap-12">
            <span className="text-3xl font-bold text-foreground">{data.temperatura}°C</span>
            <span className="text-base font-semibold text-card-foreground">{data.condicao}</span>
          </div>
          <div className="text-xs text-muted-foreground">Sensação {data.sensacao}°</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2.5 rounded-xl bg-muted/40 px-3 py-2.5">
            {item.icon}
            <div>
              <div className="text-[11px] text-muted-foreground">{item.label}</div>
              <div className="text-sm font-bold text-card-foreground">{item.value}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
