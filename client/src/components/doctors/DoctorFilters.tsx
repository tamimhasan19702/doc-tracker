"use client";

import { useEffect, useRef, useState } from "react";

import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDoctorsStore } from "@/store/doctors-store";

const DEBOUNCE_DELAY = 400;

function FilterInput({
  label,
  value,
  onDebounced,
  placeholder,
}: {
  label: string;
  value: string;
  onDebounced: (value: string) => void;
  placeholder: string;
}) {
  const [local, setLocal] = useState(value);
  const [prevValue, setPrevValue] = useState(value);
  const onDebouncedRef = useRef(onDebounced);
  const debounced = useDebouncedValue(local, DEBOUNCE_DELAY);
  const skippedFirst = useRef(false);

  // Keep the latest callback without re-running the debounce effect below.
  useEffect(() => {
    onDebouncedRef.current = onDebounced;
  });

  // Reflect external changes to the store value (e.g. Reset) in the input.
  if (prevValue !== value) {
    setPrevValue(value);
    setLocal(value);
  }

  // Push the settled value up, skipping the initial mount.
  useEffect(() => {
    if (!skippedFirst.current) {
      skippedFirst.current = true;
      return;
    }
    onDebouncedRef.current(debounced);
  }, [debounced]);

  return (
    <div className="grid gap-1.5">
      <label className="text-xs text-muted-foreground">{label}</label>
      <Input
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

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
