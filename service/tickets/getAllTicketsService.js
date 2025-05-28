const { Ticket } = require('../../models');

const getAllTicketsService = async ({ eventId, status, page = 1, limit = 10 }) => {
    const filter = {};
    if (eventId) filter.eventId = eventId;
    if (status) filter.status = status;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const tickets = await Ticket.find(filter)
        .populate('eventId', 'title startDate endDate')
        .populate('bookingId', 'bookingReference status')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10));

    const total = await Ticket.countDocuments(filter);

    return {
        status: 200,
        response: {
            success: true,
            data: {
                tickets,
                pagination: {
                    current: parseInt(page, 10),
                    total: Math.ceil(total / parseInt(limit, 10)),
                    count: tickets.length,
                    totalTickets: total,
                },
            },
        },
    };
};

module.exports = getAllTicketsService;
