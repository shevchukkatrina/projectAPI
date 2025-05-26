const { controllerWrapper } = require('../../utils');

const createBooking = require('./createBooking');
const deleteBooking = require('./deleteBooking');
const getAllBookings = require('./getAllBookings');
const getBooking = require('./getBooking');
const updateBooking = require('./updateBooking');

module.exports = {
    createBooking: controllerWrapper(createBooking),
    deleteBooking: controllerWrapper(deleteBooking),
    getAllBookings: controllerWrapper(getAllBookings),
    getBooking: controllerWrapper(getBooking),
    updateBooking: controllerWrapper(updateBooking),
};
