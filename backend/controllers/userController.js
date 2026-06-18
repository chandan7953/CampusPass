const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Booking = require("../models/Booking");

const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const {
  uploadToCloudinary,
} = require("../services/cloudinaryService");


// ======================
// GET PROFILE
// ======================

const getProfile = async (
  req,
  res,
  next
) => {
  try {
    const user = await User.findById(
      req.user.id
    ).select("-password");

    res.status(200).json(
      new ApiResponse(
        200,
        "Profile fetched successfully",
        user
      )
    );
  } catch (error) {
    next(error);
  }
};


// ======================
// UPDATE PROFILE
// ======================

const updateProfile = async (
  req,
  res,
  next
) => {
  try {
    const {
      fullName,
      mobile,
      department,
      year,
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        fullName,
        mobile,
        department,
        year,
      },
      {
        new: true,
      }
    ).select("-password");

    res.status(200).json(
      new ApiResponse(
        200,
        "Profile updated successfully",
        user
      )
    );
  } catch (error) {
    next(error);
  }
};


// ======================
// CHANGE PASSWORD
// ======================

const changePassword = async (
  req,
  res,
  next
) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    const user = await User.findById(
      req.user.id
    );

    const isMatched =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!isMatched) {
      throw new ApiError(
        400,
        "Current password is incorrect"
      );
    }

    user.password =
      await bcrypt.hash(
        newPassword,
        10
      );

    await user.save();

    res.status(200).json(
      new ApiResponse(
        200,
        "Password changed successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};


// ======================
// PROFILE IMAGE
// ======================

const uploadProfileImage =
  async (
    req,
    res,
    next
  ) => {
    try {
      if (!req.file) {
        throw new ApiError(
          400,
          "Please upload image"
        );
      }

      const result =
        await uploadToCloudinary(
          req.file,
          "campuspass/profile"
        );

      const user =
        await User.findByIdAndUpdate(
          req.user.id,
          {
            profileImage:
              result.secure_url,
          },
          {
            new: true,
          }
        ).select("-password");

      res.status(200).json(
        new ApiResponse(
          200,
          "Profile image uploaded",
          user
        )
      );
    } catch (error) {
      next(error);
    }
  };


// ======================
// ADD FAVORITE
// ======================

const addFavorite = async (
  req,
  res,
  next
) => {
  try {
    const { eventId } =
      req.params;

    const user = await User.findById(
      req.user.id
    );

    if (
      !user.favorites.includes(
        eventId
      )
    ) {
      user.favorites.push(
        eventId
      );

      await user.save();
    }

    res.status(200).json(
      new ApiResponse(
        200,
        "Added to favorites"
      )
    );
  } catch (error) {
    next(error);
  }
};


// ======================
// REMOVE FAVORITE
// ======================

const removeFavorite =
  async (
    req,
    res,
    next
  ) => {
    try {
      const { eventId } =
        req.params;

      const user =
        await User.findById(
          req.user.id
        );

      user.favorites =
        user.favorites.filter(
          (id) =>
            id.toString() !==
            eventId
        );

      await user.save();

      res.status(200).json(
        new ApiResponse(
          200,
          "Favorite removed"
        )
      );
    } catch (error) {
      next(error);
    }
  };


// ======================
// GET FAVORITES
// ======================

const getFavorites =
  async (
    req,
    res,
    next
  ) => {
    try {
      const user =
        await User.findById(
          req.user.id
        ).populate(
          "favorites"
        );

      res.status(200).json(
        new ApiResponse(
          200,
          "Favorites fetched",
          user.favorites
        )
      );
    } catch (error) {
      next(error);
    }
  };


// ======================
// MY BOOKINGS
// ======================

const getMyBookings =
  async (
    req,
    res,
    next
  ) => {
    try {
      const bookings =
        await Booking.find({
          userId:
            req.user.id,
        })
          .populate(
            "eventId"
          )
          .populate(
            "ticketId"
          );

      res.status(200).json(
        new ApiResponse(
          200,
          "Bookings fetched",
          bookings
        )
      );
    } catch (error) {
      next(error);
    }
  };

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  uploadProfileImage,
  addFavorite,
  removeFavorite,
  getFavorites,
  getMyBookings,
};