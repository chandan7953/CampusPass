const User = require("../models/User");
const Event = require("../models/Event");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");

const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");




const getDashboardStats = async (
  req,
  res,
  next
) => {
  try {
    const totalUsers =
      await User.countDocuments();

    const totalEvents =
      await Event.countDocuments();

    const totalBookings =
      await Booking.countDocuments();

    const revenueData =
      await Payment.aggregate([
        {
          $match: {
            status: "paid",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$amount",
            },
          },
        },
      ]);

    const totalRevenue =
      revenueData[0]
        ?.totalRevenue || 0;

    res.status(200).json(
      new ApiResponse(
        200,
        "Dashboard stats fetched",
        {
          totalUsers,
          totalEvents,
          totalBookings,
          totalRevenue,
        }
      )
    );
  } catch (error) {
    next(error);
  }
};




const getAllUsers = async (
  req,
  res,
  next
) => {
  try {
    const users =
      await User.find()
        .select("-password")
        .sort({
          createdAt: -1,
        });

    res.status(200).json(
      new ApiResponse(
        200,
        "Users fetched successfully",
        users
      )
    );
  } catch (error) {
    next(error);
  }
};




const getUserById = async (
  req,
  res,
  next
) => {
  try {
    const user =
      await User.findById(
        req.params.id
      ).select("-password");

    if (!user) {
      throw new ApiError(
        404,
        "User not found"
      );
    }

    res.status(200).json(
      new ApiResponse(
        200,
        "User fetched successfully",
        user
      )
    );
  } catch (error) {
    next(error);
  }
};




const blockUser = async (
  req,
  res,
  next
) => {
  try {
    const user =
      await User.findByIdAndUpdate(
        req.params.id,
        {
          isBlocked: true,
        },
        {
          new: true,
        }
      );

    if (!user) {
      throw new ApiError(
        404,
        "User not found"
      );
    }

    res.status(200).json(
      new ApiResponse(
        200,
        "User blocked successfully",
        user
      )
    );
  } catch (error) {
    next(error);
  }
};




const unblockUser =
  async (
    req,
    res,
    next
  ) => {
    try {
      const user =
        await User.findByIdAndUpdate(
          req.params.id,
          {
            isBlocked:
              false,
          },
          {
            new: true,
          }
        );

      if (!user) {
        throw new ApiError(
          404,
          "User not found"
        );
      }

      res.status(200).json(
        new ApiResponse(
          200,
          "User unblocked successfully",
          user
        )
      );
    } catch (error) {
      next(error);
    }
  };




const getAllEvents =
  async (
    req,
    res,
    next
  ) => {
    try {
      const events =
        await Event.find()
          .populate(
            "organizer",
            "fullName email"
          )
          .populate(
            "category"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json(
        new ApiResponse(
          200,
          "Events fetched successfully",
          events
        )
      );
    } catch (error) {
      next(error);
    }
  };




const approveEvent =
  async (
    req,
    res,
    next
  ) => {
    try {
      const event =
        await Event.findByIdAndUpdate(
          req.params.id,
          {
            approvalStatus:
              "approved",
            status:
              "published",
          },
          {
            new: true,
          }
        );

      if (!event) {
        throw new ApiError(
          404,
          "Event not found"
        );
      }

      res.status(200).json(
        new ApiResponse(
          200,
          "Event approved successfully",
          event
        )
      );
    } catch (error) {
      next(error);
    }
  };




const rejectEvent =
  async (
    req,
    res,
    next
  ) => {
    try {
      const event =
        await Event.findByIdAndUpdate(
          req.params.id,
          {
            approvalStatus:
              "rejected",
          },
          {
            new: true,
          }
        );

      if (!event) {
        throw new ApiError(
          404,
          "Event not found"
        );
      }

      res.status(200).json(
        new ApiResponse(
          200,
          "Event rejected successfully",
          event
        )
      );
    } catch (error) {
      next(error);
    }
  };




const deleteEvent =
  async (
    req,
    res,
    next
  ) => {
    try {
      const event =
        await Event.findById(
          req.params.id
        );

      if (!event) {
        throw new ApiError(
          404,
          "Event not found"
        );
      }

      await Event.findByIdAndDelete(
        req.params.id
      );

      res.status(200).json(
        new ApiResponse(
          200,
          "Event deleted successfully"
        )
      );
    } catch (error) {
      next(error);
    }
  };




const getAllPayments =
  async (
    req,
    res,
    next
  ) => {
    try {
      const payments =
        await Payment.find()
          .populate(
            "userId",
            "fullName email"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json(
        new ApiResponse(
          200,
          "Payments fetched successfully",
          payments
        )
      );
    } catch (error) {
      next(error);
    }
  };




const getAllBookings =
  async (
    req,
    res,
    next
  ) => {
    try {
      const bookings =
        await Booking.find()
          .populate(
            "userId",
            "fullName email"
          )
          .populate(
            "eventId"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json(
        new ApiResponse(
          200,
          "Bookings fetched successfully",
          bookings
        )
      );
    } catch (error) {
      next(error);
    }
  };

module.exports = {
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
}