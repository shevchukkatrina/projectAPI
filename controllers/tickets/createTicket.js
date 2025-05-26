const { Event, Ticket } = require('../../models');

const createTicket = async (req, res) => {
    const { eventId, quantity = 1 } = req.body;

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

    if (event.status !== 'active') {
        return res.status(400).json({
            success: false,
            message: 'Cannot create tickets for inactive event',
        });
    }

    const tickets = [];
    for (let i = 0; i < quantity; i++) {
        const ticket = new Ticket({
            eventId,
            status: 'available',
        });
        tickets.push(ticket);
    }

    const savedTickets = await Ticket.insertMany(tickets);

    event.tickets.push(...savedTickets.map(ticket => ticket._id));
    event.availableTickets += quantity;
    event.totalTickets += quantity;
    await event.save();

    return res.status(201).json({
        success: true,
        message: `${quantity} tickets created successfully`,
        data: {
            tickets: savedTickets,
            eventId: event._id,
            totalCreated: quantity,
        },
    });
};

module.exports = createTicket;
