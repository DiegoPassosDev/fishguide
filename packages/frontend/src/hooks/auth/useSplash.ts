"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/useAuth";

export function useSplash() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const splashSeen = typeof window !== "undefined" && localStorage.getItem("splash-seen");

  useEffect(() => {
    if (isLoading) return;
    if (user) {
      router.replace("/today");
      return;
    }
    if (splashSeen) {
      router.replace("/login");
    }
  }, [splashSeen, user, isLoading, router]);

  const handleStart = () => {
    localStorage.setItem("splash-seen", "true");
    router.push("/login");
  };

  return { checking: !!splashSeen && !user, handleStart };
}
