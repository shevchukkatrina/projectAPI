const bookingService = require('../../service/bookings');

const getAllBookings = async (req, res) => {
    console.log({ user: req.user });
    const booking = await bookingService.getAllBooking();

    res.json({ booking });
};

module.exports = getAllBookings;
