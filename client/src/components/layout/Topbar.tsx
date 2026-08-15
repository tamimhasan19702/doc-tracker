"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/auth-store";

export function Topbar() {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 md:hidden" />
        <span className="text-sm text-muted-foreground">Welcome back</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">{user?.name ?? "Admin"}</span>
      </div>
    </header>
  );
}
