const express = require("express");

const router = express.Router();

const {
  createEvent,
  updateEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  getFeaturedEvents,
  getEventsByCategory,
  searchEvents,
  getMyEvents,
  publishEvent,
  cancelEvent,
} = require("../controllers/eventController");

const verifyToken = require("../middlewares/verifyToken");

const authorizeRole = require("../middlewares/authorizeRole");

const upload = require("../configs/multer");

// Public Routes

router.get("/", getAllEvents);

router.get("/featured", getFeaturedEvents);

router.get("/search", searchEvents);

router.get("/category/:categoryId", getEventsByCategory);

router.get("/:id", getEventById);

// Organizer Routes

router.post(
  "/",
  verifyToken,
  authorizeRole("organizer", "admin"),
  upload.single("poster"),
  createEvent,
);

router.put(
  "/:id",
  verifyToken,
  authorizeRole("organizer", "admin"),
  upload.single("poster"),
  updateEvent,
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRole("organizer", "admin"),
  deleteEvent,
);

router.get(
  "/organizer/my-events",
  verifyToken,
  authorizeRole("organizer", "admin"),
  getMyEvents,
);

router.patch(
  "/:id/publish",
  verifyToken,
  authorizeRole("organizer", "admin"),
  publishEvent,
);

router.patch(
  "/:id/cancel",
  verifyToken,
  authorizeRole("organizer", "admin"),
  cancelEvent,
);

module.exports = router;
