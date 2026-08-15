"use client";

/**
 * Doctors list page.
 *
 * Renders the doctor table with debounced search/filter inputs and pagination.
 */
import { Plus } from "lucide-react";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

import { DoctorFilters } from "@/components/doctors/DoctorFilters";
import { DoctorFormModal } from "@/components/doctors/DoctorFormModal";
import { DoctorTable } from "@/components/doctors/DoctorTable";
import { PageHeader } from "@/components/layout/PageHeader";
import { PaginationBar } from "@/components/pagination-bar";
import { Button } from "@/components/ui/button";
import { useDoctorsStore } from "@/store/doctors-store";
import type { Doctor } from "@/types";

export default function Page() {
  // states
  const page = useDoctorsStore((s) => s.page);
  const doctors = useDoctorsStore((s) => s.doctors);
  const totalPages = useDoctorsStore((s) => s.totalPages);
  const loading = useDoctorsStore((s) => s.loading);
  const error = useDoctorsStore((s) => s.error);
  const setPage = useDoctorsStore((s) => s.setPage);
  const fetchDoctors = useDoctorsStore((s) => s.fetchDoctors);
  const openCreate = useDoctorsStore((s) => s.openCreate);
  const openEdit = useDoctorsStore((s) => s.openEdit);
  const deleteDoctor = useDoctorsStore((s) => s.deleteDoctor);

  // Initial load only
  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // Confirm-then-delete
  const handleDelete = useCallback(
    (doctor: Doctor) => {
      toast(`Delete ${doctor.name}?`, {
        description: "This cannot be undone.",
        duration: Infinity,
        action: {
          label: "Delete",
          onClick: () => {
            void deleteDoctor(doctor._id).catch(() => {});
          },
        },
        cancel: {
          label: "Cancel",
          onClick: () => {},
        },
      });
    },
    [deleteDoctor]
  );

  return (
    <div className="flex flex-1 flex-col gap-6">
      <PageHeader
        title="Doctors"
        description="Manage doctors and their assigned patients."
      >
        <Button onClick={openCreate}>
          <Plus />
          Add doctor
        </Button>
      </PageHeader>

      <DoctorFilters />

      {error ? (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : (
        <div className="rounded-xl border">
          <DoctorTable
            doctors={doctors}
            loading={loading}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        </div>
      )}

      <PaginationBar page={page} totalPages={totalPages} onPageChange={setPage} />

      <DoctorFormModal />
    </div>
  );
}
