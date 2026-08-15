"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ConditionCount } from "@/types";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--primary)",
];

function ChartSkeleton() {
  return (
    <div className="flex h-64 items-center justify-center">
      <Skeleton className="size-40 rounded-full" />
    </div>
  );
}

export function ConditionChart({
  data,
  loading,
}: {
  data: ConditionCount[];
  loading: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patients by Condition</CardTitle>
        <CardDescription>Distribution across conditions.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <ChartSkeleton />
        ) : data.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            No conditions yet.
          </div>
        ) : (
          <div className="relative h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="55%"
                  outerRadius="80%"
                  paddingAngle={2}
                  stroke="var(--card)"
                >
                  {data.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[data.indexOf(entry) % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "var(--radius)",
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <p className="text-center">
                <span className="block text-2xl font-bold tabular-nums">
                  {data.reduce((sum, d) => sum + d.value, 0)}
                </span>
                <span className="text-xs text-muted-foreground">patients</span>
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
