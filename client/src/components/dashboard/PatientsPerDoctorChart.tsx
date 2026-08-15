"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DoctorPatientCount } from "@/types";

function ChartSkeleton() {
  return (
    <div className="flex h-72 items-end gap-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton
          key={i}
          className="flex-1"
          style={{ height: `${28 + ((i * 41) % 62)}%` }}
        />
      ))}
    </div>
  );
}

export function PatientsPerDoctorChart({
  data,
  loading,
}: {
  data: DoctorPatientCount[];
  loading: boolean;
}) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Patients per Doctor</CardTitle>
        <CardDescription>Top 10 doctors by patient count.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <ChartSkeleton />
        ) : data.length === 0 ? (
          <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">
            No patients yet.
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 4, right: 4, left: -18, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border)"
                />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={56}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                />
                <Tooltip
                  cursor={{ fill: "var(--muted)" }}
                  contentStyle={{
                    borderRadius: "var(--radius)",
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                  }}
                />
                <Bar
                  dataKey="count"
                  name="Patients"
                  fill="var(--chart-1)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
