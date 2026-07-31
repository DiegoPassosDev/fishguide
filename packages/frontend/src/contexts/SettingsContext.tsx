"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type WeightUnit = "kg" | "lb";
export type TemperatureUnit = "celsius" | "fahrenheit";

interface Settings {
  weightUnit: WeightUnit;
  temperatureUnit: TemperatureUnit;
  tideReminders: boolean;
  weatherAlerts: boolean;
}

interface SettingsContextType {
  settings: Settings;
  update: (partial: Partial<Settings>) => void;
}

const defaults: Settings = {
  weightUnit: "kg",
  temperatureUnit: "celsius",
  tideReminders: true,
  weatherAlerts: true,
};

const SettingsContext = createContext<SettingsContextType | null>(null);

function loadInitial(): Settings {
  if (typeof window === "undefined") return defaults;
  const stored = localStorage.getItem("settings");
  if (!stored) return defaults;
  try {
    return { ...defaults, ...(JSON.parse(stored) as Partial<Settings>) };
  } catch {
    return defaults;
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(loadInitial);

  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  const update = (partial: Partial<Settings>) =>
    setSettings((prev) => ({ ...prev, ...partial }));

  return (
    <SettingsContext.Provider value={{ settings, update }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
