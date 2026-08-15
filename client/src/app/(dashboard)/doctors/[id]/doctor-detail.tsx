"use client";

/**
 * Doctor detail page (`/doctors/[id]`).
 *
 * Loads a single doctor (with its patient count) plus the paginated list of
 * patients assigned to that doctor. Fetching + pagination are handled by the
 * zustand `doctorDetailStore` (`load` / `setPage`); pagination UI is the
 * shared `PaginationBar`.
 */
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { useCallback, useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PaginationBar } from "@/components/pagination-bar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/layout/PageHeader";
import { formatDate } from "@/lib/format";
import { useDoctorDetailStore } from "@/store/doctor-detail-store";

export function DoctorDetail() {
  const { id } = useParams<{ id: string }>();
  const doctor = useDoctorDetailStore((s) => s.doctor);
  const patients = useDoctorDetailStore((s) => s.patients);
  const loading = useDoctorDetailStore((s) => s.loading);
  const loadingPatients = useDoctorDetailStore((s) => s.loadingPatients);
  const error = useDoctorDetailStore((s) => s.error);
  const page = useDoctorDetailStore((s) => s.page);
  const totalPages = useDoctorDetailStore((s) => s.totalPages);
  const load = useDoctorDetailStore((s) => s.load);
  const setPage = useDoctorDetailStore((s) => s.setPage);

  // Load the doctor 
  useEffect(() => {
    load(id);
  }, [id, load]);

  // Pagination
  const handlePageChange = useCallback(
    (next: number) => setPage(id, next),
    [id, setPage]
  );

  if (error && !doctor) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <p className="text-muted-foreground">{error}</p>
        <Button asChild variant="outline">
          <Link href="/doctors">
            <ArrowLeft /> Back to doctors
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <Button asChild variant="ghost" size="sm" className="w-fit">
        <Link href="/doctors">
          <ArrowLeft /> Back to doctors
        </Link>
      </Button>

      {loading ? (
        <Skeleton className="h-28 w-full" />
      ) : (
        doctor && (
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle className="text-xl">{doctor.name}</CardTitle>
                {doctor.specialization && (
                  <Badge variant="secondary">{doctor.specialization}</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
              <p className="text-muted-foreground">
                Hospital:{" "}
                <span className="text-foreground">{doctor.hospital || "—"}</span>
              </p>
              <p className="text-muted-foreground">
                Phone:{" "}
                <span className="text-foreground tabular-nums">
                  {doctor.phone || "—"}
                </span>
              </p>
              <p className="text-muted-foreground">
                Email:{" "}
                <span className="text-foreground">{doctor.email || "—"}</span>
              </p>
              <p className="text-muted-foreground">
                Patients assigned:{" "}
                <span className="font-semibold text-foreground">
                  {doctor.patientCount}
                </span>
              </p>
            </CardContent>
          </Card>
        )
      )}

      <PageHeader
        title="Patients"
        description="Patients assigned to this doctor."
      />

      {/* Paginated patient list under this doctor. */}
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Added</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingPatients ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : patients.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No patients assigned yet.
                </TableCell>
              </TableRow>
            ) : (
              patients.map((patient) => (
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
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {patient.phone || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="size-3.5" />
                      {formatDate(patient.createdAt)}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationBar
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        summary
      />
    </div>
  );
}
