"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { LoginForm } from "@/components/auth/LoginForm";
import { LoginHeader } from "@/components/auth/LoginHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (token) router.replace("/dashboard");
  }, [token, router]);

  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden p-6">

      {/* Background elements */}
      <div className="pointer-events-none absolute -top-40 -left-40 size-96 rounded-full bg-primary/10 blur-3xl" />

        {/* Background elements */}
      <div className="pointer-events-none absolute -right-40 -bottom-40 size-96 rounded-full bg-primary/10 blur-3xl" />

      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <LoginHeader />
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  );
}
