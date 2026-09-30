"use client";

import type { ReactNode } from "react";

interface FilterChipProps {
  label: string;
  count: number;
  icon: ReactNode;
  isActive: boolean;
  activeColor?: string;
  onClick: () => void;
  className?: string;
}

const CHIP_BASE =
  "flex min-h-7 shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-lg backdrop-blur-sm transition-colors";

const CHIP_ACTIVE = "border-transparent text-white";
const CHIP_INACTIVE = "border-border bg-background text-foreground";

const BADGE_ACTIVE = "bg-white/25 text-white";
const BADGE_INACTIVE = "bg-muted text-muted-foreground";

export function FilterChip({
  label,
  count,
  icon,
  isActive,
  activeColor,
  onClick,
  className,
}: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`${CHIP_BASE} ${isActive ? CHIP_ACTIVE : CHIP_INACTIVE} ${className ?? ""}`}
      style={isActive ? { backgroundColor: activeColor } : undefined}
    >
      {icon}
      {label}
      <span
        className={`rounded-full px-1.5 text-[10px] ${
          isActive ? BADGE_ACTIVE : BADGE_INACTIVE
        }`}
      >
        {count}
      </span>
    </button>
  );
}
