"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDoctorsStore } from "@/store/doctors-store";

const doctorSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  specialization: z.string().trim().max(100).optional(),
  hospital: z.string().trim().max(100).optional(),
  phone: z.string().trim().max(30).optional(),
  email: z.union([z.email("Enter a valid email"), z.literal("")]).optional(),
});

type DoctorFormValues = z.infer<typeof doctorSchema>;

export function DoctorFormModal() {
  const modalOpen = useDoctorsStore((s) => s.modalOpen);
  const editingDoctor = useDoctorsStore((s) => s.editingDoctor);
  const closeModal = useDoctorsStore((s) => s.closeModal);
  const createDoctor = useDoctorsStore((s) => s.createDoctor);
  const updateDoctor = useDoctorsStore((s) => s.updateDoctor);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      name: "",
      specialization: "",
      hospital: "",
      phone: "",
      email: "",
    },
  });

  useEffect(() => {
    if (modalOpen) {
      reset({
        name: editingDoctor?.name ?? "",
        specialization: editingDoctor?.specialization ?? "",
        hospital: editingDoctor?.hospital ?? "",
        phone: editingDoctor?.phone ?? "",
        email: editingDoctor?.email ?? "",
      });
    }
  }, [modalOpen, editingDoctor, reset]);

  const onSubmit = useCallback(
    async (values: DoctorFormValues) => {
      try {
        if (editingDoctor) {
          await updateDoctor(editingDoctor._id, values);
        } else {
          await createDoctor(values);
        }
        closeModal();
      } catch {
        // Error already surfaced as a toast by the mutation.
      }
    },
    [editingDoctor, updateDoctor, createDoctor, closeModal]
  );

  return (
    <Dialog open={modalOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingDoctor ? "Edit doctor" : "Add doctor"}
          </DialogTitle>
          <DialogDescription>
            {editingDoctor
              ? "Update the doctor's details below."
              : "Register a new doctor."}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4"
          noValidate
        >
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Dr. Jane Smith"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                placeholder="Cardiology"
                {...register("specialization")}
              />
              {errors.specialization && (
                <p className="text-sm text-destructive">
                  {errors.specialization.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hospital">Hospital</Label>
              <Input
                id="hospital"
                placeholder="City General"
                {...register("hospital")}
              />
              {errors.hospital && (
                <p className="text-sm text-destructive">
                  {errors.hospital.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="+1-555-0100"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="jane@clinic.example"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {editingDoctor ? "Save changes" : "Add doctor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
