import { useCallback, useMemo } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationBarProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  summary?: boolean;
}

/**
 * Builds the pagination page list around the current page.
 * Shows all pages up to 7; beyond that it collapses to first, current ± 1
 */
function pageNumbers(current: number, totalPages: number): (number | "…")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages = new Set<number>([1, current - 1, current, current + 1, totalPages]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) out.push("…");
    out.push(p);
    prev = p;
  }
  return out;
}

/**
 * Reusable pagination bar. Hides itself when there is a single page.
 */
export function PaginationBar({
  page,
  totalPages,
  onPageChange,
  summary = false,
}: PaginationBarProps) {
  const pageList = useMemo(() => pageNumbers(page, totalPages), [page, totalPages]);

  const goPrevious = useCallback(
    () => onPageChange(Math.max(1, page - 1)),
    [onPageChange, page]
  );
  const goNext = useCallback(
    () => onPageChange(Math.min(totalPages, page + 1)),
    [onPageChange, page, totalPages]
  );

  if (totalPages <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={(e) => {
              e.preventDefault();
              goPrevious();
            }}
            className={page <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        {summary ? (
          <PaginationItem>
            <span className="px-2 text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
          </PaginationItem>
        ) : (
          pageList.map((p, i) =>
            p === "…" ? (
              <PaginationItem key={`gap-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <PaginationLink
                  isActive={p === page}
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(p);
                  }}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            )
          )
        )}
        <PaginationItem>
          <PaginationNext
            onClick={(e) => {
              e.preventDefault();
              goNext();
            }}
            className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
