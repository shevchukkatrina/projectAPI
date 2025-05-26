/* eslint-disable */
const { Event, Ticket, Booking } = require('../../models');

const createBooking = async (req, res) => {
    const { eventId, ticketQuantity = 1, contactInfo } = req.body;
    const userId = req.user._id;

    if (!eventId) {
        return res.status(400).json({
            success: false,
            message: 'Event ID is required',
        });
    }

    const event = await Event.findById(eventId);
    if (!event) {
        return res.status(404).json({
            success: false,
            message: 'Event not found',
        });
    }

    if (!event.isAvailable()) {
        return res.status(400).json({
            success: false,
            message: 'Event is not available for booking',
        });
    }

    const availableTickets = await Ticket.find({
        eventId,
        status: 'available',
    }).limit(ticketQuantity);

    if (availableTickets.length < ticketQuantity) {
        return res.status(400).json({
            success: false,
            message: `Only ${availableTickets.length} tickets available, but ${ticketQuantity} requested`,
        });
    }

    const booking = new Booking({
        userId,
        eventId,
        ticketId: [],
        contactInfo: contactInfo || {},
    });

    await booking.save();

    const reservedTicketIds = [];
    for (const ticket of availableTickets) {
        const reserved = ticket.reserve(booking._id);
        if (reserved) {
            await ticket.save();
            reservedTicketIds.push(ticket._id);
        }
    }

    booking.ticketId = reservedTicketIds;
    await booking.save();

    const newAvailableCount = await Ticket.countDocuments({
        eventId,
        status: 'available',
    });
    event.availableTickets = newAvailableCount;
    await event.save();

    const populatedBooking = await Booking.findById(booking._id)
        .populate('eventId', 'title startDate endDate')
        .populate('ticketId')
        .populate('userId', 'name email');

    return res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: populatedBooking,
    });
};

module.exports = createBooking;
