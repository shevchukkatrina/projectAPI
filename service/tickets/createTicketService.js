const { Event, Ticket } = require('../../models');

const createTicketService = async ({ eventId, quantity = 1 }) => {
    if (!eventId) {
        return { status: 400, response: { success: false, message: 'Event ID is required' } };
    }

    const event = await Event.findById(eventId);
    if (!event) {
        return { status: 404, response: { success: false, message: 'Event not found' } };
    }

    if (event.status !== 'active') {
        return { status: 400, response: { success: false, message: 'Cannot create tickets for inactive event' } };
    }

    const tickets = Array.from({ length: quantity }, () => new Ticket({ eventId, status: 'available' }));
    const savedTickets = await Ticket.insertMany(tickets);

    event.tickets.push(...savedTickets.map(t => t._id));
    event.availableTickets += quantity;
    event.totalTickets += quantity;
    await event.save();

    return {
        status: 201,
        response: {
            success: true,
            message: `${quantity} tickets created successfully`,
            data: {
                tickets: savedTickets,
                eventId: event._id,
                totalCreated: quantity,
            },
        },
    };
};

module.exports = createTicketService;
