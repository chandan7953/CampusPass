import api from "./api";

const adminService = {
  // Stats
  getDashboardStats: async () => {
    const response = await api.get("/api/admin/dashboard");
    return response.data;
  },

  // Users
  getAllUsers: async () => {
    const response = await api.get("/api/admin/users");
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/api/admin/users/${id}`);
    return response.data;
  },

  blockUser: async (id) => {
    const response = await api.patch(`/api/admin/users/${id}/block`);
    return response.data;
  },

  unblockUser: async (id) => {
    const response = await api.patch(`/api/admin/users/${id}/unblock`);
    return response.data;
  },

  // Events
  getAllEvents: async () => {
    const response = await api.get("/api/admin/events");
    return response.data;
  },

  approveEvent: async (id) => {
    const response = await api.patch(`/api/admin/events/${id}/approve`);
    return response.data;
  },

  rejectEvent: async (id) => {
    const response = await api.patch(`/api/admin/events/${id}/reject`);
    return response.data;
  },

  deleteEvent: async (id) => {
    const response = await api.delete(`/api/admin/events/${id}`);
    return response.data;
  },

  // Transactions & Bookings
  getAllPayments: async () => {
    const response = await api.get("/api/admin/payments");
    return response.data;
  },

  getAllBookings: async () => {
    const response = await api.get("/api/admin/bookings");
    return response.data;
  },

  // Category Configuration
  createCategory: async (formData) => {
    const response = await api.post("/api/categories", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateCategory: async (id, formData) => {
    const response = await api.put(`/api/categories/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await api.delete(`/api/categories/${id}`);
    return response.data;
  },

  // Venue Configuration
  createVenue: async (venueData) => {
    const response = await api.post("/api/venues", venueData);
    return response.data;
  },

  updateVenue: async (id, venueData) => {
    const response = await api.put(`/api/venues/${id}`, venueData);
    return response.data;
  },

  deleteVenue: async (id) => {
    const response = await api.delete(`/api/venues/${id}`);
    return response.data;
  },
};

export default adminService;
