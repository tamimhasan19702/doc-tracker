import axios from "axios";
import { useAuthStore } from "@/store/auth-store";

/** Shared axios instance pointing at the REST API (always normalized to end with `/api`). */
const baseURL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api")
  .replace(/\/$/, "")
  .replace(/\/api$/, "");

const apiClient = axios.create({
  baseURL: `${baseURL}/api`,
});

/** Attaches the stored JWT as `Authorization: Bearer <token>` on every request. */
apiClient.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Clears the session on 401 so the layout guard can redirect to /login. */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearSession();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
