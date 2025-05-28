/* eslint-disable no-underscore-dangle */
const { Booking } = require('../../models');

const getBooking = async (req, res) => {
  const { id: bookingId } = req.params;
  const userId = req.user._id;
  const isAdmin = req.user.role === 'admin';

  const booking = await Booking.findById(bookingId)
    .populate('eventId', 'title description startDate endDate organizerId')
    .populate('ticketId', 'status barcode reservationExpiry')
    .populate('userId', 'name email');

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found',
    });
  }

  if (!isAdmin && booking.userId._id.toString() !== userId.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized to view this booking',
    });
  }

  const bookingData = booking.toObject();
  bookingData.isExpired = booking.isExpired;
  bookingData.canBeCancelled = booking.canBeCancelled();

  return res.status(200).json({
    success: true,
    data: bookingData,
  });
};

module.exports = getBooking;
