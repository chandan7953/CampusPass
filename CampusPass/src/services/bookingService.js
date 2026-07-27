import api from "./api";

const bookingService = {
  createBooking: async (ticketId, quantity) => {
    const response = await api.post("/api/bookings", { ticketId, quantity });
    return response.data;
  },

  getMyBookings: async () => {
    const response = await api.get("/api/bookings/my-bookings");
    return response.data;
  },

  getBookingDetails: async (id) => {
    const response = await api.get(`/api/bookings/${id}`);
    return response.data;
  },

  cancelBooking: async (id) => {
    const response = await api.patch(`/api/bookings/${id}/cancel`);
    return response.data;
  },

  downloadTicket: async (id) => {
    const response = await api.get(`/api/bookings/${id}/download`);
    return response.data;
  },

  getQRCode: async (id) => {
    const response = await api.get(`/api/bookings/${id}/qr`);
    return response.data;
  },

  // Organizer/Admin confirm booking (manual check-in)
  confirmBooking: async (id) => {
    const response = await api.patch(`/api/bookings/${id}/confirm`);
    return response.data;
  },
};

export default bookingService;
