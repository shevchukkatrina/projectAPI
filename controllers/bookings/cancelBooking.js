const bookingService = require("../../service/bookings");

const cancelBooking = async (req, res) => {
  res.json({ ok: true });
};

module.exports = cancelBooking;
