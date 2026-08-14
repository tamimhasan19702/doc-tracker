export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of doctors and patients.
        </p>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed p-12 text-sm text-muted-foreground">
        Dashboard analytics coming soon.
      </div>
    </div>
  );
}
