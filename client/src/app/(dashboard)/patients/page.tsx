"use client";

/**
 * Patients list page.
 *
 */
import { Plus } from "lucide-react";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/layout/PageHeader";
import { PaginationBar } from "@/components/pagination-bar";
import { PatientFilters } from "@/components/patients/PatientFilters";
import { PatientFormModal } from "@/components/patients/PatientFormModal";
import { PatientTable } from "@/components/patients/PatientTable";
import { Button } from "@/components/ui/button";
import { usePatientsStore } from "@/store/patients-store";
import type { Patient } from "@/types";

export default function Page() {
  const page = usePatientsStore((s) => s.page);
  const patients = usePatientsStore((s) => s.patients);
  const totalPages = usePatientsStore((s) => s.totalPages);
  const loading = usePatientsStore((s) => s.loading);
  const error = usePatientsStore((s) => s.error);
  const setPage = usePatientsStore((s) => s.setPage);
  const fetchPatients = usePatientsStore((s) => s.fetchPatients);
  const openCreate = usePatientsStore((s) => s.openCreate);
  const openEdit = usePatientsStore((s) => s.openEdit);
  const deletePatient = usePatientsStore((s) => s.deletePatient);

  // Initial load only
  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Confirm-then-delete 
  const handleDelete = useCallback(
    (patient: Patient) => {
      toast(`Delete ${patient.name}?`, {
        description: "This cannot be undone.",
        duration: Infinity,
        action: {
          label: "Delete",
          onClick: () => {
            void deletePatient(patient._id).catch(() => {});
          },
        },
        cancel: {
          label: "Cancel",
          onClick: () => {},
        },
      });
    },
    [deletePatient]
  );

  return (
    <div className="flex flex-1 flex-col gap-6">
      <PageHeader
        title="Patients"
        description="Manage patients and their assigned doctors."
      >
        <Button onClick={openCreate}>
          <Plus />
          Add patient
        </Button>
      </PageHeader>

      <PatientFilters />

      {error ? (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : (
        <div className="rounded-xl border">
          <PatientTable
            patients={patients}
            loading={loading}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        </div>
      )}

      <PaginationBar page={page} totalPages={totalPages} onPageChange={setPage} />

      <PatientFormModal />
    </div>
  );
}
