import { Activity, Stethoscope, UserPlus, Users } from "lucide-react";

import { StatCard } from "@/components/dashboard/StatCard";
import { PageHeader } from "@/components/layout/PageHeader";

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 lg:gap-8">
      <PageHeader
        title="Dashboard"
        description="Overview of doctors and patients."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Doctors" value={0} icon={Stethoscope} />
        <StatCard label="Total Patients" value={0} icon={Users} />
        <StatCard label="Avg Patients / Doctor" value="0" icon={Activity} />
        <StatCard label="New Patients This Month" value={0} icon={UserPlus} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex min-h-64 items-center justify-center rounded-xl border border-dashed p-8 text-sm text-muted-foreground lg:col-span-2">
          Patients per doctor chart coming soon
        </div>
        <div className="flex min-h-64 items-center justify-center rounded-xl border border-dashed p-8 text-sm text-muted-foreground">
          Trends chart coming soon
        </div>
      </div>
    </div>
  );
}
