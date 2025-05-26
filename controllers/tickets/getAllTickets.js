const { Ticket } = require('../../models');

const getAllTickets = async (req, res) => {
    const { eventId, status, page = 1, limit = 10 } = req.query;

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

    return res.status(200).json({
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
    });
};

module.exports = getAllTickets;
