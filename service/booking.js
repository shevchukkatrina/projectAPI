const { Booking } = require('../db/models/booking.model');

const getAllBooking = async () => {
  const booking = await Booking.find();
  return booking;
};
const getBooking = async (id) => {
  const booking = await Booking.findById(id);
  return booking;
};
const createBooking = async (data) => {
  const newBooking = await Booking.create(data);
  return newBooking;
};

const updateBooking = async (bookingId, data) => {
  const updatedBooking = await Booking.findOneAndUpdate({ _id: bookingId }, data, {
    new: true,
  });
  return updatedBooking;
};

const deleteBooking = async (bookingId) => {
  const booking = await Booking.findOneAndDelete({
    _id: bookingId,
  });
};

module.exports = {
  getAllBooking,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
};