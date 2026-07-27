import api from "./api";

const authService = {
  register: async (fullName, email, mobile, password) => {
    const response = await api.post("/api/auth/register", {
      fullName,
      email,
      mobile,
      password,
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post("/api/auth/login", { email, password });
    return response.data;
  },

  sendOTP: async (email) => {
    const response = await api.post("/api/auth/send-otp", { email });
    return response.data;
  },

  verifyOTP: async (email, otp) => {
    const response = await api.post("/api/auth/verify-otp", { email, otp });
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post("/api/auth/forgot-password", { email });
    return response.data;
  },

  resetPassword: async (email, otp, password) => {
    const response = await api.post("/api/auth/reset-password", {
      email,
      otp,
      password,
    });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/api/auth/me");
    return response.data;
  },
};

export default authService;
