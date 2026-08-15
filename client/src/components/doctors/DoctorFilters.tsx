"use client";

import { FilterInput } from "@/components/FilterInput";
import { Button } from "@/components/ui/button";
import { useDoctorsStore } from "@/store/doctors-store";

export function DoctorFilters() {
  const filters = useDoctorsStore((s) => s.filters);
  const setFilters = useDoctorsStore((s) => s.setFilters);
  const resetFilters = useDoctorsStore((s) => s.resetFilters);
  const hasActiveFilters = Boolean(
    filters.search || filters.specialization || filters.hospital
  );

  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end">
      <FilterInput
        label="Search"
        value={filters.search}
        onDebounced={(search) => setFilters({ search })}
        placeholder="Name, email, phone..."
      />
      <FilterInput
        label="Specialization"
        value={filters.specialization}
        onDebounced={(specialization) => setFilters({ specialization })}
        placeholder="e.g. Cardiology"
      />
      <FilterInput
        label="Hospital"
        value={filters.hospital}
        onDebounced={(hospital) => setFilters({ hospital })}
        placeholder="e.g. City General"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={resetFilters}
        disabled={!hasActiveFilters}
      >
        Reset
      </Button>
    </div>
  );
}
