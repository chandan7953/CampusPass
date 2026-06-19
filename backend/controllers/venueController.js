const Venue = require("../models/Venue");

const apiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/ApiError");

const createVenue = async (req, res, next) => {
  try {
    const { name, address, collegeName, latitude, longitude } = req.body;

    const venue = await Venue.create({
      name,
      address,
      collegeName,
      latitude,
      longitude,
    });

    res
      .status(201)
      .json(apiResponse(201, "Venue created successfully", venue));
  } catch (error) {
    next(error);
  }
};

const updateVenue = async (req, res, next) => {
  try {
    const venue = await Venue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!venue) {
      throw new ApiError(404, "Venue not found");
    }

    res
      .status(200)
      .json(apiResponse(200, "Venue updated successfully", venue));
  } catch (error) {
    next(error);
  }
};

const deleteVenue = async (req, res, next) => {
  try {
    const venue = await Venue.findById(req.params.id);

    if (!venue) {
      throw new ApiError(404, "Venue not found");
    }

    await Venue.findByIdAndDelete(req.params.id);

    res.status(200).json(apiResponse(200, "Venue deleted successfully"));
  } catch (error) {
    next(error);
  }
};

const getAllVenues = async (req, res, next) => {
  try {
    const venues = await Venue.find().sort({
      createdAt: -1,
    });

    res
      .status(200)
      .json(apiResponse(200, "Venues fetched successfully", venues));
  } catch (error) {
    next(error);
  }
};

const getVenueById = async (req, res, next) => {
  try {
    const venue = await Venue.findById(req.params.id);

    if (!venue) {
      throw new ApiError(404, "Venue not found");
    }

    res
      .status(200)
      .json(apiResponse(200, "Venue fetched successfully", venue));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createVenue,
  updateVenue,
  deleteVenue,
  getAllVenues,
  getVenueById,
};
