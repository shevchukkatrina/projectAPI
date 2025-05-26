const bookingService = require('../../service/bookings');

const getAllBookings = async (req, res) => {
    const booking = await bookingService.getAllBooking();

    res.json({ booking });
};

module.exports = getAllBookings;
