const { Event, Ticket, Booking } = require('../../models');

const deleteBooking = async (req, res) => {
    const { id: bookingId } = req.params;
    const userId = req.user._id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
        return res.status(404).json({
            success: false,
            message: 'Booking not found',
        });
    }

    if (booking.userId.toString() !== userId.toString() && req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Unauthorized to delete this booking',
        });
    }

    if (!booking.canBeCancelled()) {
        return res.status(400).json({
            success: false,
            message: 'Booking cannot be cancelled (expired or already processed)',
        });
    }

    const cancelled = booking.cancel();
    if (!cancelled) {
        return res.status(400).json({
            success: false,
            message: 'Unable to cancel booking',
        });
    }

    await booking.save();

    const tickets = await Ticket.find({ _id: { $in: booking.ticketId } });
    for (const ticket of tickets) {
        ticket.release();
        await ticket.save();
    }

    const event = await Event.findById(booking.eventId);
    if (event) {
        const availableCount = await Ticket.countDocuments({
            eventId: booking.eventId,
            status: 'available'
        });
        event.availableTickets = availableCount;
        await event.save();
    }

    return res.status(200).json({
        success: true,
        message: 'Booking cancelled successfully',
        data: booking,
    });
};

module.exports = deleteBooking;
