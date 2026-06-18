const express = require("express");

const router = express.Router();

const {
  getDashboardStats,
  getAllUsers,
  getUserById,
  blockUser,
  unblockUser,
  getAllEvents,
  approveEvent,
  rejectEvent,
  deleteEvent,
  getAllPayments,
  getAllBookings,
} = require("../controllers/adminController");

const verifyToken = require("../middlewares/verifyToken");

const authorizeRole = require("../middlewares/authorizeRole");


router.use(verifyToken, authorizeRole("admin"));



router.get("/dashboard", getDashboardStats);



router.get("/users", getAllUsers);

router.get("/users/:id", getUserById);

router.patch("/users/:id/block", blockUser);

router.patch("/users/:id/unblock", unblockUser);



router.get("/events", getAllEvents);

router.patch("/events/:id/approve", approveEvent);

router.patch("/events/:id/reject", rejectEvent);

router.delete("/events/:id", deleteEvent);



router.get("/payments", getAllPayments);



router.get("/bookings", getAllBookings);

module.exports = router;