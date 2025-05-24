const bookingService = require("../../service/bookings");

const getBooking = async (req, res) => {
  const id = req.params.id;
  const booking = await bookingService.getBooking(id);
  res.json({ booking });
};

module.exports = getBooking;
