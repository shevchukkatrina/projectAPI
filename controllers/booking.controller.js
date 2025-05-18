const bookingService = require('../service/booking');

const getAllBooking = async (req, res) => {
  const booking = await bookingService.getAllBooking();

    res.json({ booking });
};
const getBooking = async (req, res) => {
  const id = req.params.id;
    const booking = await bookingService.getBooking(id);
    res.json({ booking });
};
const createBooking = async (req, res) => {
    const { body } = req;
    console.log(body);
    const booking = await bookingService.createBooking(body);
    res.status(201).json({ booking });
};
const updateBooking = async (req, res) => {
  const { id } = req.params;
    const result = await bookingService.updateBooking(id, req.body);
    res.json({ booking: result });
};
const deleteBooking = async (req, res) => {
    const { id } = req.params;
    const result = await bookingService.deleteBooking(id);
    res.status(204).send();
};
const getUserBookings = async (req, res) => {
    res.json({ ok: true });
}
const getEventBookings = async (req, res) => {
    res.json({ ok: true });
}
const cancelBooking = async (req, res) => {
    res.json({ ok: true });
}
const confirmBooking = async (req, res) => {
    res.json({ ok: true });
}
const getBookingStatus = async (req, res) => {
    res.json({ ok: true });
}

module.exports = {
  getAllBooking,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
  getUserBookings,
  getEventBookings,
  cancelBooking,
  confirmBooking, 
  getBookingStatus
};
