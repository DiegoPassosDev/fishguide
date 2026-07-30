"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function useSplash() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("splash-seen")) {
      router.replace("/login");
    } else {
      setChecking(false);
    }
  }, [router]);

  const handleStart = () => {
    localStorage.setItem("splash-seen", "true");
    router.push("/login");
  };

  return { checking, handleStart };
}
