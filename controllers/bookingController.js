const Booking = require("../models/Booking");
const User = require("../models/User");

// Create a new booking
exports.createBooking = async (req, res) => {
    const { userId, service, date, time } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create a new booking
        const booking = await Booking.create({ userId, service, date, time });

        // Add the booking to the user's bookings
        user.bookings.push(booking._id);
        await user.save();

        res.status(201).json({ message: "Booking created successfully", booking });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Get bookings for a user
exports.getBookingsByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json({ bookings });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
    const { bookingId } = req.params;
    const { status } = req.body;

    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        booking.status = status;
        await booking.save();

        res.status(200).json({ message: "Booking status updated successfully", booking });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
