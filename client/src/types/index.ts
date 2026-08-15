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

export interface Patient {
  _id: string;
  name: string;
  age?: number;
  gender?: "male" | "female" | "other";
  condition?: string;
  phone?: string;
  doctor: string;
  createdAt: string;
  updatedAt: string;
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
