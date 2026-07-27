import api from "./api";

const reviewService = {
  getEventReviews: async (eventId) => {
    const response = await api.get(`/api/reviews/event/${eventId}`);
    return response.data;
  },

  getEventRating: async (eventId) => {
    const response = await api.get(`/api/reviews/rating/${eventId}`);
    return response.data;
  },

  getMyReviews: async () => {
    const response = await api.get("/api/reviews/my-reviews");
    return response.data;
  },

  addReview: async (eventId, rating, comment) => {
    const response = await api.post("/api/reviews", { eventId, rating, comment });
    return response.data;
  },

  updateReview: async (id, rating, comment) => {
    const response = await api.put(`/api/reviews/${id}`, { rating, comment });
    return response.data;
  },

  deleteReview: async (id) => {
    const response = await api.delete(`/api/reviews/${id}`);
    return response.data;
  },
};

export default reviewService;
