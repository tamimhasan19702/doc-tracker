"use client";

import { FilterInput } from "@/components/FilterInput";
import { Button } from "@/components/ui/button";
import { usePatientsStore } from "@/store/patients-store";

export function PatientFilters() {
  const filters = usePatientsStore((s) => s.filters);
  const setFilters = usePatientsStore((s) => s.setFilters);
  const resetFilters = usePatientsStore((s) => s.resetFilters);
  const hasActiveFilters = Boolean(filters.search || filters.condition);

  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
      <FilterInput
        label="Search"
        value={filters.search}
        onDebounced={(search) => setFilters({ search })}
        placeholder="Name, phone..."
      />
      <FilterInput
        label="Condition"
        value={filters.condition}
        onDebounced={(condition) => setFilters({ condition })}
        placeholder="e.g. Diabetes"
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
