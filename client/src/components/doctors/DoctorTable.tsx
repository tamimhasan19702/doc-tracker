"use client";

import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { Doctor } from "@/types";

function TableSkeleton() {
  return (
    <TableBody>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-28" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-8" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-8" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}

function EmptyState() {
  return (
    <TableRow>
      <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
        No doctors found. Try adjusting your filters.
      </TableCell>
    </TableRow>
  );
}

export function DoctorTable({
  doctors,
  loading,
  onEdit,
  onDelete,
}: {
  doctors: Doctor[];
  loading: boolean;
  onEdit: (doctor: Doctor) => void;
  onDelete: (doctor: Doctor) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Specialization</TableHead>
          <TableHead>Hospital</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="w-12 text-center">View</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      {loading ? (
        <TableSkeleton />
      ) : doctors.length === 0 ? (
        <EmptyState />
      ) : (
        <TableBody>
          {doctors.map((doctor) => (
            <TableRow key={doctor._id}>
              <TableCell className="font-medium">{doctor.name}</TableCell>
              <TableCell>
                {doctor.specialization ? (
                  <Badge variant="secondary">{doctor.specialization}</Badge>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>{doctor.hospital || "—"}</TableCell>
              <TableCell className="tabular-nums">
                {doctor.phone || "—"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {doctor.email || "—"}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon-sm" asChild aria-label="View">
                  <Link href={`/doctors/${doctor._id}`}>
                    <Eye />
                  </Link>
                </Button>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" aria-label="Actions">
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(doctor)}>
                      <Pencil /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => onDelete(doctor)}
                    >
                      <Trash2 /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      )}
    </Table>
  );
}
