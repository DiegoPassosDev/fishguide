"use client";

import { type ReactNode } from "react";

interface InputFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  icon?: ReactNode;
  rightIcon?: ReactNode;
  onRightIconClick?: () => void;
  onChange: (value: string) => void;
}

export function InputField({
  label,
  type = "text",
  placeholder,
  value,
  icon,
  rightIcon,
  onRightIconClick,
  onChange,
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </label>
      <div className="flex items-center gap-2.5 rounded-xl border border-input bg-muted/50 px-3.5 py-3 transition-colors focus-within:border-teal-bright">
        {icon && <span className="shrink-0 opacity-50">{icon}</span>}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
        />
        {rightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="shrink-0 opacity-50 hover:opacity-100"
          >
            {rightIcon}
          </button>
        )}
      </div>
    </div>
  );
}
