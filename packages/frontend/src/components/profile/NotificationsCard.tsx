"use client";

import { Waves, CloudSun } from "lucide-react";
import { Switch } from "@base-ui/react/switch";
import { useSettings } from "@/contexts/SettingsContext";

function NotificationRow({
  icon,
  title,
  description,
  checked,
  onCheckedChange,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-muted/60 p-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch.Root
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-label={title}
        className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-transparent bg-clip-padding transition-colors outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[checked]:bg-primary data-[unchecked]:bg-border"
      >
        <Switch.Thumb className="block size-4 translate-x-1 rounded-full bg-background shadow transition-transform duration-200 data-[checked]:translate-x-6 data-[checked]:bg-primary-foreground" />
      </Switch.Root>
    </div>
  );
}

export function NotificationsCard() {
  const { settings, update } = useSettings();

  return (
    <section className="mb-3 rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-lg leading-none">🔔</span>
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Notificações
        </h2>
      </div>

      <div className="flex flex-col gap-2">
        <NotificationRow
          icon={<Waves size={16} />}
          title="Lembrete de marés"
          description="Avisos antes da maré alta/baixa"
          checked={settings.tideReminders}
          onCheckedChange={(value) => update({ tideReminders: value })}
        />
        <NotificationRow
          icon={<CloudSun size={16} />}
          title="Condições do tempo"
          description="Alertas de mudanças climáticas"
          checked={settings.weatherAlerts}
          onCheckedChange={(value) => update({ weatherAlerts: value })}
        />
      </div>
    </section>
  );
}
