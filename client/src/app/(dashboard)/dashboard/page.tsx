"use client";

import { useEffect } from "react";
import { Activity, Stethoscope, UserPlus, Users } from "lucide-react";

import { ConditionChart } from "@/components/dashboard/ConditionChart";
import { DateTrendChart } from "@/components/dashboard/DateTrendChart";
import { PatientsPerDoctorChart } from "@/components/dashboard/PatientsPerDoctorChart";
import { StatCard } from "@/components/dashboard/StatCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStore } from "@/store/dashboard-store";

export default function DashboardPage() {
  // states
  const summary = useDashboardStore((s) => s.summary);
  const patientsPerDoctor = useDashboardStore((s) => s.patientsPerDoctor);
  const trends = useDashboardStore((s) => s.trends);
  const conditions = useDashboardStore((s) => s.conditions);
  const period = useDashboardStore((s) => s.period);
  const loading = useDashboardStore((s) => s.loading);
  const error = useDashboardStore((s) => s.error);
  const fetchAll = useDashboardStore((s) => s.fetchAll);
  const setPeriod = useDashboardStore((s) => s.setPeriod);

  // Initial load only
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <div className="flex flex-1 flex-col gap-6 lg:gap-8">
      <PageHeader
        title="Dashboard"
        description="Overview of doctors and patients."
      />

      {error ? (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {loading && !summary
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-xl" />
                ))
              : summary && (
                  <>
                    <StatCard
                      label="Total Doctors"
                      value={summary.totalDoctors}
                      icon={Stethoscope}
                    />
                    <StatCard
                      label="Total Patients"
                      value={summary.totalPatients}
                      icon={Users}
                    />
                    <StatCard
                      label="Avg Patients / Doctor"
                      value={summary.avgPerDoctor}
                      icon={Activity}
                    />
                    <StatCard
                      label="New Patients This Month"
                      value={summary.newPatientsThisMonth}
                      icon={UserPlus}
                    />
                  </>
                )}
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <PatientsPerDoctorChart
              data={patientsPerDoctor}
              loading={loading}
            />
            <ConditionChart data={conditions} loading={loading} />
            <DateTrendChart
              data={trends}
              period={period}
              onPeriodChange={setPeriod}
              loading={loading}
            />
          </div>
        </>
      )}
    </div>
  );
}
