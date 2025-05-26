const bookingService = require('../../service/bookings');

const createBooking = async (req, res) => {
    const { body } = req;
    console.log(body);
    const booking = await bookingService.createBooking(body);
    res.status(201).json({ booking });
};

module.exports = createBooking;
