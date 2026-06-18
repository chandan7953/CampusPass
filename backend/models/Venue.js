const mongoose = require("mongoose");

const venueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    collegeName: {
      type: String,
      required: true,
    },

    latitude: Number,

    longitude: Number,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Venue", venueSchema);
