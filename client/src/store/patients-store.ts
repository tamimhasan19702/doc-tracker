"use client";

import { create } from "zustand";
import { toast } from "sonner";

import apiClient from "@/lib/api-client";
import { apiErrorMessage } from "@/lib/api-error";
import type {
  ApiResponse,
  Paginated,
  Patient,
  PatientsState,
} from "@/types";

export const usePatientsStore = create<PatientsState>((set, get) => ({
  filters: { search: "", condition: "" },
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  patients: [],
  loading: true,
  error: null,
  modalOpen: false,
  editingPatient: null,

  setFilters: (patch) => {
    set((s) => ({ filters: { ...s.filters, ...patch }, page: 1 }));
    get().fetchPatients();
  },
  resetFilters: () => {
    set({ filters: { search: "", condition: "" }, page: 1 });
    get().fetchPatients();
  },
  setPage: (page) => {
    set({ page });
    get().fetchPatients();
  },
  openCreate: () => set({ modalOpen: true, editingPatient: null }),
  openEdit: (patient) => set({ modalOpen: true, editingPatient: patient }),
  closeModal: () => set({ modalOpen: false, editingPatient: null }),

  fetchPatients: async () => {
    const { filters, page, limit } = get();
    set({ loading: true, error: null });
    try {
      const { data } = await apiClient.get<Paginated<Patient>>("/patients", {
        params: {
          search: filters.search || undefined,
          condition: filters.condition || undefined,
          page,
          limit,
        },
      });
      const totalPages = Math.max(data.totalPages, 1);
      set({
        patients: data.data,
        total: data.total,
        totalPages,
      });
      if (page > totalPages) {
        get().setPage(totalPages);
        return;
      }
    } catch (err) {
      set({ error: apiErrorMessage(err, "Failed to load patients") });
    } finally {
      set({ loading: false });
    }
  },

  createPatient: async (input) => {
    try {
      const { data } = await apiClient.post<ApiResponse<Patient>>(
        `/doctors/${input.doctor}/patients`,
        input
      );
      toast.success(`Patient ${data.data.name} created`);
      get().fetchPatients();
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to create patient"));
      throw err;
    }
  },

  updatePatient: async (id, input) => {
    try {
      const { data } = await apiClient.put<ApiResponse<Patient>>(
        `/patients/${id}`,
        input
      );
      toast.success(`Patient ${data.data.name} updated`);
      get().fetchPatients();
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to update patient"));
      throw err;
    }
  },

  deletePatient: async (id) => {
    try {
      const { data } = await apiClient.delete<ApiResponse<Patient>>(
        `/patients/${id}`
      );
      toast.success(`Patient ${data.data.name} deleted`);
      get().fetchPatients();
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to delete patient"));
      throw err;
    }
  },
}));
