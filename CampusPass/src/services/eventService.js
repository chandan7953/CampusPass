import api from "./api";

const eventService = {
  // Public Event API calls
  getAllEvents: async () => {
    const response = await api.get("/api/events");
    return response.data;
  },

  getFeaturedEvents: async () => {
    const response = await api.get("/api/events/featured");
    return response.data;
  },

  getEventById: async (id) => {
    const response = await api.get(`/api/events/${id}`);
    return response.data;
  },

  getEventsByCategory: async (categoryId) => {
    const response = await api.get(`/api/events/category/${categoryId}`);
    return response.data;
  },

  searchEvents: async (keyword) => {
    const response = await api.get(`/api/events/search?keyword=${encodeURIComponent(keyword)}`);
    return response.data;
  },

  // Categories & Venues (needed during creation/listing)
  getCategories: async () => {
    const response = await api.get("/api/categories");
    return response.data;
  },

  getVenues: async () => {
    const response = await api.get("/api/venues");
    return response.data;
  },

  // Organizer Event Management
  createEvent: async (formData) => {
    const response = await api.post("/api/events", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateEvent: async (id, formData) => {
    const response = await api.put(`/api/events/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteEvent: async (id) => {
    const response = await api.delete(`/api/events/${id}`);
    return response.data;
  },

  getMyEvents: async () => {
    const response = await api.get("/api/events/organizer/my-events");
    return response.data;
  },

  publishEvent: async (id) => {
    const response = await api.patch(`/api/events/${id}/publish`);
    return response.data;
  },

  cancelEvent: async (id) => {
    const response = await api.patch(`/api/events/${id}/cancel`);
    return response.data;
  },

  // Ticket APIs (since tickets belong to events)
  getEventTickets: async (eventId) => {
    const response = await api.get(`/api/tickets/event/${eventId}`);
    return response.data;
  },

  getTicketById: async (id) => {
    const response = await api.get(`/api/tickets/${id}`);
    return response.data;
  },

  createTicket: async (ticketData) => {
    const response = await api.post("/api/tickets", ticketData);
    return response.data;
  },

  updateTicket: async (id, ticketData) => {
    const response = await api.put(`/api/tickets/${id}`, ticketData);
    return response.data;
  },

  deleteTicket: async (id) => {
    const response = await api.delete(`/api/tickets/${id}`);
    return response.data;
  },
};

export default eventService;
