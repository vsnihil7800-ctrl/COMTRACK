import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

let authStore = {
  getSession: () => null,
  setSession: () => {}
};

export function registerAuthStore(store) {
  authStore = store;
}

export function setToken(token) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status !== 401 || error.config._retry) {
      return Promise.reject(error);
    }
    const session = authStore.getSession();
    if (!session?.refreshToken) return Promise.reject(error);
    try {
      error.config._retry = true;
      const { data } = await api.post("/auth/refresh", { refreshToken: session.refreshToken });
      authStore.setSession(data);
      setToken(data.token);
      error.config.headers.Authorization = `Bearer ${data.token}`;
      return api(error.config);
    } catch {
      authStore.setSession(null);
      return Promise.reject(error);
    }
  }
);

// Keep Render backend alive - ping every 10 minutes
setInterval(() => {
  fetch("https://comtrack.onrender.com")
    .catch(() => {}); // silent fail
}, 10 * 60 * 1000);
