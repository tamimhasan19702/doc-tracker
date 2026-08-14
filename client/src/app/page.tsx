"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

const emptySubscribe = () => () => {};

export default function Home() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  useEffect(() => {
    if (isHydrated) router.replace(token ? "/dashboard" : "/login");
  }, [isHydrated, token, router]);

  return null;
}
