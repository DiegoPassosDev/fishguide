"use client";

import { useSplash } from "@/hooks/auth/useSplash";
import { SplashScreen } from "@/components/auth/SplashScreen";

export default function Home() {
  const { checking, handleStart } = useSplash();

  if (checking) return null;

  return <SplashScreen onStart={handleStart} />;
}
