export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthState {
  token: string | null;
  user: AuthUser | null;
  setSession: (token: string, user: AuthUser) => void;
  clearSession: () => void;
};

export interface Doctor {
  _id: string;
  name: string;
  specialization?: string;
  hospital?: string;
  phone?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorDetail extends Doctor {
  patientCount: number;
}

export interface DoctorDetailState {
  doctor: DoctorDetail | null;
  patients: Patient[];
  loading: boolean;
  loadingPatients: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  load: (id: string) => Promise<void>;
  fetchPatients: (id: string, page: number) => Promise<void>;
  setPage: (id: string, page: number) => void;
};

export interface DoctorInput {
  name: string;
  specialization?: string;
  hospital?: string;
  phone?: string;
  email?: string;
}

export interface DoctorsState {
  filters: DoctorsFilters;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  doctors: Doctor[];
  loading: boolean;
  error: string | null;
  modalOpen: boolean;
  editingDoctor: Doctor | null;
  setFilters: (patch: Partial<DoctorsFilters>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  openCreate: () => void;
  openEdit: (doctor: Doctor) => void;
  closeModal: () => void;
  fetchDoctors: () => Promise<void>;
  createDoctor: (input: DoctorInput) => Promise<void>;
  updateDoctor: (id: string, input: DoctorInput) => Promise<void>;
  deleteDoctor: (id: string) => Promise<void>;
};

/** Populated doctor reference returned by patient endpoints. */
export interface PatientDoctor {
  _id: string;
  name: string;
  specialization?: string;
}

export interface Patient {
  _id: string;
  name: string;
  age?: number;
  gender?: "male" | "female" | "other";
  condition?: string;
  phone?: string;
  /** ObjectId string on unpopulated responses, populated object on the list/detail endpoints. */
  doctor: string | PatientDoctor;
  createdAt: string;
  updatedAt: string;
}

export interface PatientInput {
  name: string;
  age?: number | "";
  gender?: "male" | "female" | "other" | "";
  condition?: string;
  phone?: string;
  doctor: string;
}

export interface PatientsFilters {
  search: string;
  condition: string;
}

export interface PatientsState {
  filters: PatientsFilters;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  patients: Patient[];
  loading: boolean;
  error: string | null;
  modalOpen: boolean;
  editingPatient: Patient | null;
  setFilters: (patch: Partial<PatientsFilters>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  openCreate: () => void;
  openEdit: (patient: Patient) => void;
  closeModal: () => void;
  fetchPatients: () => Promise<void>;
  createPatient: (input: PatientInput) => Promise<void>;
  updatePatient: (id: string, input: PatientInput) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface Paginated<T> {
  success: boolean;
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DoctorsFilters {
  search: string;
  specialization: string;
  hospital: string;
}

/** Headline stats for the dashboard stat cards. */
export interface DashboardSummary {
  totalDoctors: number;
  totalPatients: number;
  newPatientsThisMonth: number;
  avgPerDoctor: number;
}

/** One row from /dashboard/patients-per-doctor. */
export interface DoctorPatientCount {
  doctorId: string;
  name: string | null;
  specialization?: string | null;
  count: number;
}

export type TrendPeriod = "daily" | "weekly" | "monthly";

/** One row from /dashboard/trends. */
export interface TrendPoint {
  date: string;
  patients: number;
  doctors: number;
}

/** One slice from /dashboard/conditions (for a donut chart). */
export interface ConditionCount {
  name: string;
  value: number;
}

export interface DashboardState {
  summary: DashboardSummary | null;
  patientsPerDoctor: DoctorPatientCount[];
  trends: TrendPoint[];
  conditions: ConditionCount[];
  period: TrendPeriod;
  loading: boolean;
  error: string | null;
  setPeriod: (period: TrendPeriod) => void;
  fetchSummary: () => Promise<void>;
  fetchPatientsPerDoctor: () => Promise<void>;
  fetchTrends: () => Promise<void>;
  fetchConditions: () => Promise<void>;
  fetchAll: () => Promise<void>;
}
