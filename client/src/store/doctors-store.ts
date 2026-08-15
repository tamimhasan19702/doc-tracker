import { create } from "zustand";
import { toast } from "sonner";

import apiClient from "@/lib/api-client";
import type {
  ApiResponse,
  Doctor,
  DoctorsState,
  Paginated,
} from "@/types";

function errorMessage(err: unknown, fallback: string): string {
  const data = (err as { response?: { data?: { message?: string } } })
    ?.response?.data;
  return data?.message ?? fallback;
}

export const useDoctorsStore = create<DoctorsState>((set, get) => ({
  filters: { search: "", specialization: "", hospital: "" },
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  doctors: [],
  loading: true,
  error: null,
  modalOpen: false,
  editingDoctor: null,

  setFilters: (patch) => {
    set((s) => ({ filters: { ...s.filters, ...patch }, page: 1 }));
    get().fetchDoctors();
  },
  resetFilters: () => {
    set({ filters: { search: "", specialization: "", hospital: "" }, page: 1 });
    get().fetchDoctors();
  },
  setPage: (page) => {
    set({ page });
    get().fetchDoctors();
  },
  openCreate: () => set({ modalOpen: true, editingDoctor: null }),
  openEdit: (doctor) => set({ modalOpen: true, editingDoctor: doctor }),
  closeModal: () => set({ modalOpen: false, editingDoctor: null }),

  fetchDoctors: async () => {
    const { filters, page, limit } = get();
    set({ loading: true, error: null });
    try {
      const { data } = await apiClient.get<Paginated<Doctor>>("/doctors", {
        params: {
          search: filters.search || undefined,
          specialization: filters.specialization || undefined,
          hospital: filters.hospital || undefined,
          page,
          limit,
        },
      });
      set({
        doctors: data.data,
        total: data.total,
        totalPages: data.totalPages,
      });
    } catch (err) {
      set({ error: errorMessage(err, "Failed to load doctors") });
    } finally {
      set({ loading: false });
    }
  },

  createDoctor: async (input) => {
    try {
      const { data } = await apiClient.post<ApiResponse<Doctor>>(
        "/doctors",
        input
      );
      toast.success(`Doctor ${data.data.name} created`);
      get().fetchDoctors();
    } catch (err) {
      toast.error(errorMessage(err, "Failed to create doctor"));
      throw err;
    }
  },

  updateDoctor: async (id, input) => {
    try {
      const { data } = await apiClient.put<ApiResponse<Doctor>>(
        `/doctors/${id}`,
        input
      );
      toast.success(`Doctor ${data.data.name} updated`);
      get().fetchDoctors();
    } catch (err) {
      toast.error(errorMessage(err, "Failed to update doctor"));
      throw err;
    }
  },

  deleteDoctor: async (id) => {
    try {
      const { data } = await apiClient.delete<ApiResponse<Doctor>>(
        `/doctors/${id}`
      );
      toast.success(`Doctor ${data.data.name} deleted`);
      get().fetchDoctors();
    } catch (err) {
      toast.error(errorMessage(err, "Failed to delete doctor"));
      throw err;
    }
  },
}));
