const express = require("express");

const router = express.Router();

const {
  createBooking,
  confirmBooking,
  cancelBooking,
  getBookingDetails,
  getMyBookings,
  downloadTicket,
  getQRCode,
} = require("../controllers/bookingController");

const verifyToken = require("../middlewares/verifyToken");

const authorizeRole = require("../middlewares/authorizeRole");


router.post("/", verifyToken, createBooking);

router.get("/my-bookings", verifyToken, getMyBookings);

router.get("/:id", verifyToken, getBookingDetails);

router.patch("/:id/cancel", verifyToken, cancelBooking);

router.get("/:id/download", verifyToken, downloadTicket);

router.get("/:id/qr", verifyToken, getQRCode);


router.patch(
  "/:id/confirm",
  verifyToken,
  authorizeRole("organizer", "admin"),
  confirmBooking,
);

module.exports = router;
