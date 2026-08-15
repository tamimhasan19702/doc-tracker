import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { DoctorDetail } from "./doctor-detail";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 flex-col gap-6">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <DoctorDetail />
    </Suspense>
  );
}
