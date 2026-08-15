import { create } from "zustand";

import apiClient from "@/lib/api-client";
import { apiErrorMessage } from "@/lib/api-error";
import type {
  ApiResponse,
  DoctorDetail,
  DoctorDetailState,
  Paginated,
  Patient,
} from "@/types";

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
      set({ error: apiErrorMessage(err, "Failed to load doctor") });
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
      const totalPages = Math.max(data.totalPages, 1);
      set({
        patients: data.data,
        page: Math.min(page, totalPages),
        total: data.total,
        totalPages,
      });
      if (page > totalPages) {
        get().setPage(id, totalPages);
        return;
      }
    } catch (err) {
      set({ error: apiErrorMessage(err, "Failed to load patients") });
    } finally {
      set({ loadingPatients: false });
    }
  },

  setPage: (id, page) => get().fetchPatients(id, page),
}));
