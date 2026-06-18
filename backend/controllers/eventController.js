const Event = require("../models/Event");
const Category = require("../models/Category");
const Venue = require("../models/Venue");

const apiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/ApiError");

const { uploadToCloudinary } = require("../services/cloudinaryService");

const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      venue,
      startDate,
      endDate,
      capacity,
    } = req.body;

    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      throw new ApiError(404, "Category not found");
    }

    const venueExists = await Venue.findById(venue);

    if (!venueExists) {
      throw new ApiError(404, "Venue not found");
    }

    let poster = "";

    if (req.file) {
      const result = await uploadToCloudinary(req.file, "campuspass/events");

      poster = result.secure_url;
    }

    const event = await Event.create({
      title,
      description,
      poster,
      category,
      venue,
      organizer: req.user.id,
      startDate,
      endDate,
      capacity,
    });

    res.status(201).json(apiResponse(201, "Event created successfully", event));
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      throw new ApiError(404, "Event not found");
    }

    if (event.organizer.toString() !== req.user.id) {
      throw new ApiError(403, "Unauthorized");
    }

    Object.assign(event, req.body);

    if (req.file) {
      const result = await uploadToCloudinary(req.file, "campuspass/events");

      event.poster = result.secure_url;
    }

    await event.save();

    res.status(200).json(apiResponse(200, "Event updated successfully", event));
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      throw new ApiError(404, "Event not found");
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json(apiResponse(200, "Event deleted successfully"));
  } catch (error) {
    next(error);
  }
};

const getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.find()
      .populate("category")
      .populate("venue")
      .populate("organizer", "fullName email")
      .sort({
        createdAt: -1,
      });

    res
      .status(200)
      .json(apiResponse(200, "Events fetched successfully", events));
  } catch (error) {
    next(error);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("category")
      .populate("venue")
      .populate("organizer", "fullName email");

    if (!event) {
      throw new ApiError(404, "Event not found");
    }

    res.status(200).json(apiResponse(200, "Event fetched successfully", event));
  } catch (error) {
    next(error);
  }
};

const getFeaturedEvents = async (req, res, next) => {
  try {
    const events = await Event.find({
      isFeatured: true,
    });

    res.status(200).json(apiResponse(200, "Featured events fetched", events));
  } catch (error) {
    next(error);
  }
};

const getEventsByCategory = async (req, res, next) => {
  try {
    const events = await Event.find({
      category: req.params.categoryId,
    });

    res.status(200).json(apiResponse(200, "Category events fetched", events));
  } catch (error) {
    next(error);
  }
};

const searchEvents = async (req, res, next) => {
  try {
    const { keyword } = req.query;

    const events = await Event.find({
      title: {
        $regex: keyword,
        $options: "i",
      },
    });

    res.status(200).json(apiResponse(200, "Search completed", events));
  } catch (error) {
    next(error);
  }
};

const getMyEvents = async (req, res, next) => {
  try {
    const events = await Event.find({
      organizer: req.user.id,
    });

    res.status(200).json(apiResponse(200, "Organizer events fetched", events));
  } catch (error) {
    next(error);
  }
};

const publishEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      {
        status: "published",
      },
      {
        new: true,
      },
    );

    res.status(200).json(apiResponse(200, "Event published", event));
  } catch (error) {
    next(error);
  }
};

const cancelEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      {
        status: "cancelled",
      },
      {
        new: true,
      },
    );

    res.status(200).json(apiResponse(200, "Event cancelled", event));
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
