const express = require("express");

const router =
  express.Router();

const {
  getProfile,
  updateProfile,
  changePassword,
  uploadProfileImage,
  addFavorite,
  removeFavorite,
  getFavorites,
  getMyBookings,
} = require(
  "../controllers/userController"
);

const verifyToken = require(
  "../middlewares/verifyToken"
);

const upload = require(
  "../configs/multer"
);


// Profile

router.get(
  "/profile",
  verifyToken,
  getProfile
);

router.put(
  "/profile",
  verifyToken,
  updateProfile
);


// Password

router.patch(
  "/change-password",
  verifyToken,
  changePassword
);


// Image Upload

router.patch(
  "/profile-image",
  verifyToken,
  upload.single(
    "profileImage"
  ),
  uploadProfileImage
);


// Favorites

router.post(
  "/favorites/:eventId",
  verifyToken,
  addFavorite
);

router.delete(
  "/favorites/:eventId",
  verifyToken,
  removeFavorite
);

router.get(
  "/favorites",
  verifyToken,
  getFavorites
);


// Bookings

router.get(
  "/bookings",
  verifyToken,
  getMyBookings
);

module.exports = router;