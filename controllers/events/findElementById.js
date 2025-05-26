const mongoose = require('mongoose');
const { Event } = require('../../models');

/**
 * Controller method to find an event by its ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const findEventById = async (req, res) => {
    try {
        const { id: eventId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid event ID format',
            });
        }

        const event = await Event.findById(eventId).populate({
            path: 'tickets',
            match: { status: 'available' },
            select: 'type price section row seat',
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }

        const now = new Date();
        const eventData = event.toObject();

        eventData.isPast = event.endDate < now;
        eventData.isComing = event.startDate > now;
        eventData.isOngoing = event.startDate <= now && event.endDate >= now;
        eventData.isSoldOut = event.availableTickets <= 0;

        const daysUntilEvent =
            event.startDate > now ? Math.ceil((event.startDate - now) / (1000 * 60 * 60 * 24)) : 0;

        eventData.daysUntilEvent = daysUntilEvent;

        const ticketData = {};
        if (event.tickets && event.tickets.length > 0) {
            event.tickets.forEach(ticket => {
                ticketData[ticket.type] = ticketData[ticket.type] || {
                    count: 0,
                    minPrice: Infinity,
                    maxPrice: 0,
                };

                ticketData[ticket.type].count++;
                ticketData[ticket.type].minPrice = Math.min(
                    ticketData[ticket.type].minPrice,
                    ticket.price,
                );
                ticketData[ticket.type].maxPrice = Math.max(
                    ticketData[ticket.type].maxPrice,
                    ticket.price,
                );
            });
        }

        eventData.ticketSummary = ticketData;

        if (event.tickets && event.tickets.length > 20) {
            delete eventData.tickets;
            eventData.ticketsCount = event.tickets.length;
        }

        return res.status(200).json({
            success: true,
            data: eventData,
        });
    } catch (error) {
        console.error('Error fetching event by ID:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching event',
        });
    }
};

module.exports = findEventById;
