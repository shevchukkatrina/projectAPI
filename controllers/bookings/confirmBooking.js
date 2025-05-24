const bookingService = require("../../service/bookings");

const confirmBooking = async (req, res) => {
  res.json({ ok: true });
};

module.exports = confirmBooking;
