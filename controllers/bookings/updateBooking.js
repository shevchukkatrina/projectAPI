const bookingService = require("../../service/bookings");

const updateBooking = async (req, res) => {
  const { id } = req.params;
  const result = await bookingService.updateBooking(id, req.body);
  res.json({ booking: result });
};

module.exports = updateBooking;
