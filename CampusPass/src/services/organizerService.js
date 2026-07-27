import api from "./api";

const organizerService = {
  getDashboardStats: async () => {
    const response = await api.get("/api/organizer/dashboard");
    return response.data;
  },

  getRevenueStats: async () => {
    const response = await api.get("/api/organizer/revenue");
    return response.data;
  },

  getEventAnalytics: async () => {
    const response = await api.get("/api/organizer/analytics");
    return response.data;
  },

  getAttendees: async (eventId) => {
    const response = await api.get(`/api/organizer/attendees/${eventId}`);
    return response.data;
  },

  scanTicket: async (bookingCode) => {
    const response = await api.post("/api/organizer/scan-ticket", { bookingCode });
    return response.data;
  },

  exportAttendees: async (eventId) => {
    const response = await api.get(`/api/organizer/export/${eventId}`);
    return response.data;
  },
};

export default organizerService;
