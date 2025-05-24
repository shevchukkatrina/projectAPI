const bookingService = require("../../service/bookings");

const getUserBookings = async (req, res) => {
  res.json({ ok: true });
};

module.exports = getUserBookings;
