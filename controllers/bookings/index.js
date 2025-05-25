const { controllerWrapper } = require("../../utils");

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
  cancelBooking: controllerWrapper(cancelBooking),
  confirmBooking: controllerWrapper(confirmBooking),
  createBooking: controllerWrapper(createBooking),
  deleteBooking: controllerWrapper(deleteBooking),
  getAllBookings: controllerWrapper(getAllBookings),
  getBooking: controllerWrapper(getBooking),
  getBookingStatus: controllerWrapper(getBookingStatus),
  getEventBookings: controllerWrapper(getEventBookings),
  getUserBookings: controllerWrapper(getUserBookings),
  updateBooking: controllerWrapper(updateBooking),
};
