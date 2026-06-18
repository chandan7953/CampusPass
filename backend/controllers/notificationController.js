const Notification = require("../models/Notification");

const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      userId: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Notifications fetched successfully",
          notifications,
        ),
      );
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      throw new ApiError(404, "Notification not found");
    }

    notification.isRead = true;

    await notification.save();

    res
      .status(200)
      .json(new ApiResponse(200, "Notification marked as read", notification));
  } catch (error) {
    next(error);
  }
};

const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      {
        userId: req.user.id,
        isRead: false,
      },
      {
        isRead: true,
      },
    );

    res
      .status(200)
      .json(new ApiResponse(200, "All notifications marked as read"));
  } catch (error) {
    next(error);
  }
};

const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      throw new ApiError(404, "Notification not found");
    }

    await Notification.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json(new ApiResponse(200, "Notification deleted successfully"));
  } catch (error) {
    next(error);
  }
};

const getUnreadCount = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.user.id,
      isRead: false,
    });

    res
      .status(200)
      .json(new ApiResponse(200, "Unread count fetched", { count }));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
};
