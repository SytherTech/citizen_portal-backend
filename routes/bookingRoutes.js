const express = require("express");
const {
    createBooking,
    getBookingsByUser,
    updateBookingStatus,
} = require("../controllers/bookingController");

const router = express.Router();

// Create a booking
router.post("/", createBooking);

// Get bookings for a specific user
router.get("/:userId", getBookingsByUser);

// Update booking status
router.put("/:bookingId", updateBookingStatus);

module.exports = router;
