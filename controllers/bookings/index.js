const cancelBooking = require("./cancelBooking");
const confirmBooking = require("./confirmBooking");
const createBooking = require("./createBooking");
const deleteBooking = require("./deleteBooking");
const getAllBookings = require("./getAllBookings");
const getBooking = require("./getBooking");
const getBookingStatus = require("./getBookingStatus");
const getEventBookings = require("./getEventBookings");
const getUserBookings = require("./getUserBookings");
const updateBooking = require("./updateBooking");

module.exports = {
  cancelBooking,
  confirmBooking,
  createBooking,
  deleteBooking,
  getAllBookings,
  getBooking,
  getBookingStatus,
  getEventBookings,
  getUserBookings,
  updateBooking,
};
