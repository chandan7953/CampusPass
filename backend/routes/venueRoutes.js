const express = require("express");

const router = express.Router();

const {
  createVenue,
  updateVenue,
  deleteVenue,
  getAllVenues,
  getVenueById,
} = require("../controllers/venueController");

const verifyToken = require("../middlewares/verifyToken");

const authorizeRole = require("../middlewares/authorizeRole");

router.get("/", getAllVenues);

router.get("/:id", getVenueById);

router.post("/", verifyToken, authorizeRole("admin"), createVenue);

router.put("/:id", verifyToken, authorizeRole("admin"), updateVenue);

router.delete("/:id", verifyToken, authorizeRole("admin"), deleteVenue);

module.exports = router;
