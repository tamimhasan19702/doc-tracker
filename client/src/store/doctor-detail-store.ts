import { create } from "zustand";

import apiClient from "@/lib/api-client";
import type {
  ApiResponse,
  DoctorDetail,
  DoctorDetailState,
  Paginated,
  Patient,
} from "@/types";

function errorMessage(err: unknown, fallback: string): string {
  const data = (err as { response?: { data?: { message?: string } } })
    ?.response?.data;
  return data?.message ?? fallback;
}

export const useDoctorDetailStore = create<DoctorDetailState>((set, get) => ({
  doctor: null,
  patients: [],
  loading: false,
  loadingPatients: false,
  error: null,
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,

  load: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiClient.get<ApiResponse<DoctorDetail>>(
        `/doctors/${id}`
      );
      set({ doctor: data.data });
    } catch (err) {
      set({ error: errorMessage(err, "Failed to load doctor") });
    } finally {
      set({ loading: false });
    }
    get().fetchPatients(id, 1);
  },

  fetchPatients: async (id, page) => {
    const { limit } = get();
    set({ loadingPatients: true });
    try {
      const { data } = await apiClient.get<Paginated<Patient>>(
        `/doctors/${id}/patients`,
        { params: { page, limit } }
      );
      set({
        patients: data.data,
        page,
        total: data.total,
        totalPages: data.totalPages,
      });
    } catch (err) {
      set({ error: errorMessage(err, "Failed to load patients") });
    } finally {
      set({ loadingPatients: false });
    }
  },

  setPage: (id, page) => get().fetchPatients(id, page),
}));
