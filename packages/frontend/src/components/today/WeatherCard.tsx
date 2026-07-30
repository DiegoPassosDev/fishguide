"use client";

import { Sun, CloudSun, Cloud, CloudRain, CloudLightning, CloudDrizzle, CloudFog, Wind, Gauge, Droplets } from "lucide-react";

import type { ComponentType } from "react";

const CONDITION_ICON: Record<string, { icon: ComponentType<{ size?: number; className?: string }>; color: string }> = {
  "Ensolarado": { icon: Sun, color: "text-amber-400" },
  "Céu Limpo": { icon: Sun, color: "text-amber-400" },
  "Parcialmente Nublado": { icon: CloudSun, color: "text-sky-400" },
  "Nublado": { icon: Cloud, color: "text-gray-400" },
  "Chuvoso": { icon: CloudRain, color: "text-blue-400" },
  "Tempestade": { icon: CloudLightning, color: "text-violet-400" },
  "Chuva Fraca": { icon: CloudDrizzle, color: "text-blue-300" },
  "Neblina": { icon: CloudFog, color: "text-gray-300" },
};

interface WeatherCardProps {
  data: {
    temperatura: number;
    sensacao: number;
    condicao: string;
    vento: number;
    pressao: number;
    umidade: number;
    chuva: number;
  };
}

export function WeatherCard({ data }: WeatherCardProps) {
  const iconConfig = CONDITION_ICON[data.condicao] ?? CONDITION_ICON["Ensolarado"];
  const WeatherIcon = iconConfig.icon;

  const items = [
    { icon: <Wind size={14} className="text-sky-400" />, label: "Vento", value: `${data.vento} km/h` },
    { icon: <Gauge size={14} className="text-violet-400" />, label: "Pressão", value: `${data.pressao} hPa` },
    { icon: <Droplets size={14} className="text-blue-400" />, label: "Umidade", value: `${data.umidade}%` },
    { icon: <CloudRain size={14} className="text-cyan-400" />, label: "Chuva", value: `${data.chuva}%` },
  ];

  return (
    <section className="mb-3 rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-lg leading-none">🌤</span>
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Clima
        </h2>
      </div>

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
    </section>
  );
}
