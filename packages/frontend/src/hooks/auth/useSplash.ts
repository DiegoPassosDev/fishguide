"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useSplash() {
  const router = useRouter();
  const splashSeen = typeof window !== "undefined" && localStorage.getItem("splash-seen");

  useEffect(() => {
    if (splashSeen) {
      router.replace("/login");
    }
  }, [splashSeen, router]);

  const handleStart = () => {
    localStorage.setItem("splash-seen", "true");
    router.push("/login");
  };

  return { checking: !!splashSeen, handleStart };
}
