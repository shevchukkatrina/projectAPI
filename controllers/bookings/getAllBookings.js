/* eslint-disable no-underscore-dangle */
const { Booking } = require('../../models');

const getAllBookings = async (req, res) => {
    const { eventId, status, userId, page = 1, limit = 10 } = req.query;
    const requestingUserId = req.user._id;
    const isAdmin = req.user.role === 'admin';

    const filter = {};
    if (eventId) filter.eventId = eventId;
    if (status) filter.status = status;

    if (userId) {
        if (!isAdmin && userId !== requestingUserId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to view other users bookings',
            });
        }
        filter.userId = userId;
    } else if (!isAdmin) {
        filter.userId = requestingUserId;
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const bookings = await Booking.find(filter)
        .populate('eventId', 'title startDate endDate organizerId')
        .populate('ticketId', 'status barcode')
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10));

    const total = await Booking.countDocuments(filter);

    return res.status(200).json({
        success: true,
        data: {
            bookings,
            pagination: {
                current: parseInt(page, 10),
                total: Math.ceil(total / parseInt(limit, 10)),
                count: bookings.length,
                totalBookings: total,
            },
        },
    });
};

module.exports = getAllBookings;
