const { Ticket } = require('../../models');

const getAllTickets = async (req, res) => {
    const { eventId, status, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (eventId) filter.eventId = eventId;
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tickets = await Ticket.find(filter)
        .populate('eventId', 'title startDate endDate')
        .populate('bookingId', 'bookingReference status')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await Ticket.countDocuments(filter);

    return res.status(200).json({
        success: true,
        data: {
            tickets,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / parseInt(limit)),
                count: tickets.length,
                totalTickets: total,
            },
        },
    });
};

module.exports = getAllTickets;
