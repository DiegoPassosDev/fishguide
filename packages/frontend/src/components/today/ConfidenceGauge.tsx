"use client";

import { useEffect, useState } from "react";

interface ConfidenceGaugeProps {
  value: number;
}

export function ConfidenceGauge({ value }: ConfidenceGaugeProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(value);
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  const dashArray = 104.1;
  const dashOffset = dashArray - (displayValue / 100) * dashArray;
  const needleAngle = (displayValue / 100) * 180;

  return (
    <div className="flex items-center justify-center gap-4">
      <div className="text-center">
        <div className="text-xs font-medium text-muted-foreground">Confiança</div>
        <div className="text-base font-bold text-foreground">{value}%</div>
      </div>

      <svg width="100" height="60" viewBox="0 0 100 60">
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#14847f" />
            <stop offset="100%" stopColor="#22d3b8" />
          </linearGradient>
        </defs>
        <path
          d="M14 50 A36 36 0 0 1 86 50"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          className="opacity-10"
        />
        <path
          d="M14 50 A36 36 0 0 1 86 50"
          stroke="url(#gaugeGrad)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dashArray} 999`}
          strokeDashoffset={mounted ? dashOffset : dashArray}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.33, 1, 0.68, 1)" }}
        />
        <g
          style={{
            transform: `rotate(${mounted ? needleAngle : 0}deg)`,
            transformOrigin: "50px 50px",
            transition: "transform 1.2s cubic-bezier(0.33, 1, 0.68, 1)",
          }}
        >
          <polygon points="16,50 48,44 48,56" fill="#71757e" />
          <polygon points="19,50 47,46 47,54" fill="#a0a5b0" />
        </g>
        <circle cx="50" cy="50" r="4.5" fill="#22d3b8" />
        <circle cx="50" cy="50" r="2" fill="#0a1628" />
      </svg>
    </div>
  );
}
