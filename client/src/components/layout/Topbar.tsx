"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";

export function Topbar() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.clearSession);

  const handleLogout = () => {
    clearSession();
    router.replace("/login");
  };

  return (
    <header className="flex h-14 items-center justify-between border-b px-6">
      <p className="text-sm text-muted-foreground">Welcome back</p>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">{user?.name ?? "Admin"}</span>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
}
