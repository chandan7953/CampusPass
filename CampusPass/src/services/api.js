import axios from "axios";
import { Platform } from "react-native";
import { store } from "../redux/store";
import { logout } from "../redux/slices/authSlice";

const getBaseURL = () => {
  // Android emulator uses 10.0.2.2 to access host's localhost
  if (Platform.OS === "android") {
    return "http://10.0.2.2:5000";
  }
  return "http://localhost:5000";
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        // Automatically dispatch logout on token expiry / unauthorized
        store.dispatch(logout());
      }
    }
    return Promise.reject(error);
  }
);

export default api;
