const { Event, Ticket, Booking } = require('../../models');

const updateBooking = async (req, res) => {
    const { id: bookingId } = req.params;
    const { contactInfo, status } = req.body;
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
            message: 'Unauthorized to update this booking',
        });
    }

    if (contactInfo) {
        booking.contactInfo = { ...booking.contactInfo, ...contactInfo };
    }

    if (status) {
        let updated = false;
        switch (status) {
            case 'confirmed':
                updated = booking.confirm();
                if (updated) {
                    // Confirm sale of all tickets
                    const tickets = await Ticket.find({ _id: { $in: booking.ticketId } });
                    for (const ticket of tickets) {
                        ticket.confirmSale();
                        await ticket.save();
                    }
                }
                break;
            case 'cancelled':
                updated = booking.cancel();
                if (updated) {
                    const tickets = await Ticket.find({ _id: { $in: booking.ticketId } });
                    for (const ticket of tickets) {
                        ticket.release();
                        await ticket.save();
                    }
                }
                break;
            case 'completed':
                updated = booking.complete();
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid status provided',
                });
        }

        if (!updated) {
            return res.status(400).json({
                success: false,
                message: `Cannot change booking status to ${status}`,
            });
        }
    }

    await booking.save();

    if (status && ['cancelled', 'confirmed'].includes(status)) {
        const event = await Event.findById(booking.eventId);
        if (event) {
            const availableCount = await Ticket.countDocuments({
                eventId: booking.eventId,
                status: 'available'
            });
            event.availableTickets = availableCount;
            await event.save();
        }
    }

    const updatedBooking = await Booking.findById(bookingId)
        .populate('eventId', 'title startDate endDate')
        .populate('ticketId')
        .populate('userId', 'name email');

    return res.status(200).json({
        success: true,
        message: 'Booking updated successfully',
        data: updatedBooking,
    });
};

module.exports = updateBooking;
