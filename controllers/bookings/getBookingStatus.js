const bookingService = require("../../service/bookings");

const getBookingStatus = async (req, res) => {
  res.json({ ok: true });
};

module.exports = getBookingStatus;
