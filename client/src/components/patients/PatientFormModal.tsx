"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import apiClient from "@/lib/api-client";
import { usePatientsStore } from "@/store/patients-store";
import type { Doctor, Paginated, PatientInput } from "@/types";

const patientSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  age: z
    .union([
      z.literal(""),
      z
        .string()
        .regex(/^\d+$/, "Enter a valid age")
        .refine((v) => Number(v) >= 0 && Number(v) <= 150, "Age must be 0–150"),
    ])
    .optional(),
  gender: z
    .union([z.literal(""), z.enum(["male", "female", "other"])])
    .optional(),
  condition: z.string().trim().max(100).optional(),
  phone: z.string().trim().max(30).optional(),
  doctor: z.string().trim().min(1, "Assign a doctor"),
});

type PatientFormValues = z.infer<typeof patientSchema>;

export function PatientFormModal() {
  const modalOpen = usePatientsStore((s) => s.modalOpen);
  const editingPatient = usePatientsStore((s) => s.editingPatient);
  const closeModal = usePatientsStore((s) => s.closeModal);
  const createPatient = usePatientsStore((s) => s.createPatient);
  const updatePatient = usePatientsStore((s) => s.updatePatient);

  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: "",
      age: "",
      gender: "",
      condition: "",
      phone: "",
      doctor: "",
    },
  });

  useEffect(() => {
    if (modalOpen) {
      reset({
        name: editingPatient?.name ?? "",
        age:
          editingPatient?.age != null ? String(editingPatient.age) : "",
        gender: editingPatient?.gender ?? "",
        condition: editingPatient?.condition ?? "",
        phone: editingPatient?.phone ?? "",
        doctor:
          typeof editingPatient?.doctor === "string"
            ? editingPatient.doctor
            : editingPatient?.doctor?._id ?? "",
      });

      let cancelled = false;
      async function loadDoctors() {
        try {
          const all: Doctor[] = [];
          const first = await apiClient.get<Paginated<Doctor>>("/doctors", {
            params: { page: 1, limit: 100 },
          });
          all.push(...first.data.data);
          for (let page = 2; page <= first.data.totalPages && !cancelled; page++) {
            const { data } = await apiClient.get<Paginated<Doctor>>(
              "/doctors",
              { params: { page, limit: 100 } }
            );
            all.push(...data.data);
          }
          if (!cancelled) setDoctors(all);
        } catch {
          if (!cancelled) setDoctors([]);
        }
      }
      void loadDoctors();
      return () => {
        cancelled = true;
      };
    }
  }, [modalOpen, editingPatient, reset]);

  const onSubmit = useCallback(
    async (values: PatientFormValues) => {
      const payload: PatientInput = {
        ...values,
        age: values.age === "" ? "" : Number(values.age),
      };
      try {
        if (editingPatient) {
          await updatePatient(editingPatient._id, payload);
        } else {
          await createPatient(payload);
        }
        closeModal();
      } catch {
        // Error already surfaced as a toast by the mutation.
      }
    },
    [editingPatient, updatePatient, createPatient, closeModal]
  );

  return (
    <Dialog open={modalOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingPatient ? "Edit patient" : "Add patient"}
          </DialogTitle>
          <DialogDescription>
            {editingPatient
              ? "Update the patient's details below."
              : "Register a new patient and assign a doctor."}
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
              placeholder="Jane Smith"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="42"
                aria-invalid={!!errors.age}
                {...register("age")}
              />
              {errors.age && (
                <p className="text-sm text-destructive">
                  {errors.age.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label>Gender</Label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger aria-label="Gender">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="condition">Condition</Label>
              <Input
                id="condition"
                placeholder="Diabetes"
                {...register("condition")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="+1-555-0100"
                {...register("phone")}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Doctor</Label>
            <Controller
              name="doctor"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    aria-label="Doctor"
                    className={errors.doctor ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Select a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor._id} value={doctor._id}>
                        {doctor.name}
                        {doctor.specialization ? ` — ${doctor.specialization}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.doctor && (
              <p className="text-sm text-destructive">
                {errors.doctor.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {editingPatient ? "Save changes" : "Add patient"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
