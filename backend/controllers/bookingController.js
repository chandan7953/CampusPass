const Booking = require("../models/Booking");
const Ticket = require("../models/Ticket");
const Event = require("../models/Event");

const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const generateBookingCode = require("../utils/generateBookingCode");

const { generateQRCode } = require("../services/qrService");


const createBooking = async (req, res, next) => {
  try {
    const { ticketId, quantity } = req.body;

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new ApiError(404, "Ticket not found");
    }

    if (ticket.remainingQuantity < quantity) {
      throw new ApiError(400, "Not enough tickets available");
    }

    const event = await Event.findById(ticket.eventId);

    if (!event) {
      throw new ApiError(404, "Event not found");
    }

    const bookingCode = generateBookingCode();

    const totalAmount = ticket.price * quantity;

    const qrCode = await generateQRCode(bookingCode);

    const booking = await Booking.create({
      userId: req.user.id,

      eventId: ticket.eventId,

      ticketId,

      quantity,

      totalAmount,

      bookingCode,

      qrCode,

      bookingStatus: "pending",

      paymentStatus: "pending",
    });

    ticket.remainingQuantity -= quantity;

    if (ticket.remainingQuantity === 0) {
      ticket.status = "sold_out";
    }

    await ticket.save();

    res
      .status(201)
      .json(new ApiResponse(201, "Booking created successfully", booking));
  } catch (error) {
    next(error);
  }
};


const confirmBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      throw new ApiError(404, "Booking not found");
    }

    booking.bookingStatus = "confirmed";

    booking.paymentStatus = "paid";

    await booking.save();

    res.status(200).json(new ApiResponse(200, "Booking confirmed", booking));
  } catch (error) {
    next(error);
  }
};


const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      throw new ApiError(404, "Booking not found");
    }

    if (booking.bookingStatus === "cancelled") {
      throw new ApiError(400, "Booking already cancelled");
    }

    const ticket = await Ticket.findById(booking.ticketId);

    ticket.remainingQuantity += booking.quantity;

    ticket.status = "active";

    await ticket.save();

    booking.bookingStatus = "cancelled";

    await booking.save();

    res
      .status(200)
      .json(new ApiResponse(200, "Booking cancelled successfully"));
  } catch (error) {
    next(error);
  }
};



const getBookingDetails = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("eventId")
      .populate("ticketId")
      .populate("userId", "fullName email");

    if (!booking) {
      throw new ApiError(404, "Booking not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, "Booking details fetched", booking));
  } catch (error) {
    next(error);
  }
};



const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({
      userId: req.user.id,
    })
      .populate("eventId")
      .populate("ticketId");

    res.status(200).json(new ApiResponse(200, "Bookings fetched", bookings));
  } catch (error) {
    next(error);
  }
};



const downloadTicket = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      throw new ApiError(404, "Booking not found");
    }

    res.status(200).json(
      new ApiResponse(200, "Ticket download data", {
        bookingCode: booking.bookingCode,
        qrCode: booking.qrCode,
      }),
    );
  } catch (error) {
    next(error);
  }
};


const getQRCode = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      throw new ApiError(404, "Booking not found");
    }

    res.status(200).json(
      new ApiResponse(200, "QR code fetched", {
        qrCode: booking.qrCode,
      }),
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  confirmBooking,
  cancelBooking,
  getBookingDetails,
  getMyBookings,
  downloadTicket,
  getQRCode,
};
