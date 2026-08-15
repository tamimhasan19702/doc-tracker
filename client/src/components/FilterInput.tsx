"use client";

import { useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

const DEBOUNCE_DELAY = 1000;

/**
 * Debounced text input for filter bars. Typing updates the local value
 */
export function FilterInput({
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
