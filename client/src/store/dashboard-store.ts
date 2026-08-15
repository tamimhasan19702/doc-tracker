import { create } from "zustand";

import apiClient from "@/lib/api-client";
import { apiErrorMessage } from "@/lib/api-error";
import type {
  ApiResponse,
  ConditionCount,
  DashboardState,
  DashboardSummary,
  DoctorPatientCount,
  TrendPoint,
} from "@/types";

export const useDashboardStore = create<DashboardState>((set, get) => ({
  summary: null,
  patientsPerDoctor: [],
  trends: [],
  conditions: [],
  period: "daily",
  loading: true,
  error: null,

  setPeriod: (period) => {
    set({ period });
    get().fetchTrends();
  },

  fetchSummary: async () => {
    try {
      const { data } = await apiClient.get<ApiResponse<DashboardSummary>>(
        "/dashboard/summary"
      );
      set({ summary: data.data });
    } catch (err) {
      set({ error: apiErrorMessage(err, "Failed to load summary") });
    }
  },

  fetchPatientsPerDoctor: async () => {
    try {
      const { data } = await apiClient.get<
        ApiResponse<DoctorPatientCount[]>
      >("/dashboard/patients-per-doctor");
      set({ patientsPerDoctor: data.data });
    } catch (err) {
      set({ error: apiErrorMessage(err, "Failed to load patients per doctor") });
    }
  },

  fetchTrends: async () => {
    const { period } = get();
    try {
      const { data } = await apiClient.get<ApiResponse<TrendPoint[]>>(
        "/dashboard/trends",
        { params: { period } }
      );
      set({ trends: data.data });
    } catch (err) {
      set({ error: apiErrorMessage(err, "Failed to load trends") });
    }
  },

  fetchConditions: async () => {
    try {
      const { data } = await apiClient.get<ApiResponse<ConditionCount[]>>(
        "/dashboard/conditions"
      );
      set({ conditions: data.data });
    } catch (err) {
      set({ error: apiErrorMessage(err, "Failed to load conditions") });
    }
  },

  fetchAll: async () => {
    const { fetchSummary, fetchPatientsPerDoctor, fetchTrends, fetchConditions } =
      get();
    set({ loading: true, error: null });
    try {
      await Promise.all([
        fetchSummary(),
        fetchPatientsPerDoctor(),
        fetchTrends(),
        fetchConditions(),
      ]);
    } finally {
      set({ loading: false });
    }
  },
}));
