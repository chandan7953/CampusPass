import api from "./api";

const paymentService = {
  createOrder: async (bookingId) => {
    const response = await api.post("/api/payments/create-order", { bookingId });
    return response.data;
  },

  verifyPayment: async (paymentData) => {
    // paymentData: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
    const response = await api.post("/api/payments/verify", paymentData);
    return response.data;
  },

  getPaymentDetails: async (id) => {
    const response = await api.get(`/api/payments/${id}`);
    return response.data;
  },

  refundPayment: async (id) => {
    const response = await api.post(`/api/payments/refund/${id}`);
    return response.data;
  },
};

export default paymentService;
