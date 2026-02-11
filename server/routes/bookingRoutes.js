const express = require("express");
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  cancelBooking,
  getPropertyBookings,   // ✅ CORRECT NAME
} = require("../controllers/bookingController");

const authMiddleware = require("../middleware/authMiddleware");

// 🔓 Public – availability calendar
router.get("/property/:propertyId", getPropertyBookings);

// 🔐 Private – booking actions
router.post("/", authMiddleware, createBooking);
router.get("/my", authMiddleware, getMyBookings);
router.put("/:id/cancel", authMiddleware, cancelBooking);

module.exports = router;
