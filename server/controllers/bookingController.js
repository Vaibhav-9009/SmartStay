const Booking = require("../models/Booking");
const Property = require("../models/Property");

/**
 * @desc    Create booking (auto price + prevent double booking)
 * @route   POST /api/bookings
 * @access  Private
 */
exports.createBooking = async (req, res) => {
  try {
    const { property, checkInDate, checkOutDate } = req.body;

    // 1️⃣ Validate property
    const propertyData = await Property.findById(property);
    if (!propertyData) {
      return res.status(404).json({ message: "Property not found" });
    }

    // 2️⃣ Check overlapping bookings
    const overlappingBooking = await Booking.findOne({
      property,
      status: "booked",
      checkInDate: { $lt: new Date(checkOutDate) },
      checkOutDate: { $gt: new Date(checkInDate) },
    });

    if (overlappingBooking) {
      return res.status(400).json({
        message: "Property is already booked for selected dates",
      });
    }

    // 3️⃣ Calculate number of nights
    const nights =
      (new Date(checkOutDate) - new Date(checkInDate)) /
      (1000 * 60 * 60 * 24);

    if (nights <= 0) {
      return res.status(400).json({ message: "Invalid dates" });
    }

    // 4️⃣ Calculate total price
    const totalPrice = nights * propertyData.pricePerNight;

    // 5️⃣ Create booking
    const booking = new Booking({
      user: req.user.id,
      property,
      checkInDate,
      checkOutDate,
      totalPrice,
    });

    const savedBooking = await booking.save();

    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create booking",
      error: error.message,
    });
  }
};

/**
 * @desc    Get logged-in user's bookings
 * @route   GET /api/bookings/my
 * @access  Private
 */
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("property", "title city pricePerNight images")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};
/**
 * @desc    Cancel booking with refund logic
 * @route   PUT /api/bookings/:id/cancel
 * @access  Private
 */
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only booking owner can cancel
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking already cancelled" });
    }

    const now = new Date();
    const checkInDate = new Date(booking.checkInDate);

    // Calculate hours before check-in
    const hoursBeforeCheckIn =
      (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    let refundAmount = 0;

    // Refund rule
    if (hoursBeforeCheckIn >= 24) {
      refundAmount = booking.totalPrice; // full refund
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({
      message: "Booking cancelled successfully",
      refundAmount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to cancel booking",
      error: error.message,
    });
  }
};

/**
 * @desc    Get booked date ranges for a property (availability calendar)
 * @route   GET /api/bookings/property/:propertyId
 * @access  Public
 */
exports.getPropertyAvailability = async (req, res) => {
  try {
    const bookings = await Booking.find({
      property: req.params.propertyId,
      status: "booked",
    }).select("checkInDate checkOutDate -_id");

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch availability",
      error: error.message,
    });
  }
};
/**
 * @desc    Get booked dates for a property
 * @route   GET /api/bookings/property/:propertyId
 * @access  Public
 */
exports.getPropertyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      property: req.params.propertyId,
      status: "booked",
    }).select("checkInDate checkOutDate");

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch property bookings",
      error: error.message,
    });
  }
};