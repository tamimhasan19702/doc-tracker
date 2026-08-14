import { Stethoscope } from "lucide-react";

export function LoginHeader() {
  return (
    <div className="grid justify-items-center gap-3 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Stethoscope className="size-6" />
      </div>
      <div className="grid gap-1">
        <h1 className="text-xl font-bold">Doctor Tracker</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>
    </div>
  );
}
