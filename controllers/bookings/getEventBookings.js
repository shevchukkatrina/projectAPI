const bookingService = require('../../service/bookings');

const getEventBookings = async (req, res) => {
    res.json({ ok: true });
};

module.exports = getEventBookings;
