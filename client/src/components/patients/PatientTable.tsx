"use client";

import { Calendar, MoreHorizontal, Pencil, Trash2, User } from "lucide-react";

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
import { formatDate } from "@/lib/format";
import type { Patient, PatientDoctor } from "@/types";

function doctorName(doctor: string | PatientDoctor): string {
  return typeof doctor === "string" ? doctor : doctor.name;
}

function TableSkeleton() {
  return (
    <TableBody>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-8" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-28" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20" />
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
      <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
        No patients found. Try adjusting your filters.
      </TableCell>
    </TableRow>
  );
}

export function PatientTable({
  patients,
  loading,
  onEdit,
  onDelete,
}: {
  patients: Patient[];
  loading: boolean;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Age</TableHead>
          <TableHead>Gender</TableHead>
          <TableHead>Condition</TableHead>
          <TableHead>Doctor</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Added</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      {loading ? (
        <TableSkeleton />
      ) : patients.length === 0 ? (
        <EmptyState />
      ) : (
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient._id}>
              <TableCell className="font-medium">
                <span className="flex items-center gap-2">
                  <User className="size-4 text-muted-foreground" />
                  {patient.name}
                </span>
              </TableCell>
              <TableCell className="tabular-nums">
                {patient.age ?? "—"}
              </TableCell>
              <TableCell className="capitalize">
                {patient.gender || "—"}
              </TableCell>
              <TableCell>
                {patient.condition ? (
                  <Badge variant="outline">{patient.condition}</Badge>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>{doctorName(patient.doctor)}</TableCell>
              <TableCell className="tabular-nums">
                {patient.phone || "—"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  {formatDate(patient.createdAt)}
                </span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" aria-label="Actions">
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(patient)}>
                      <Pencil /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => onDelete(patient)}
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
