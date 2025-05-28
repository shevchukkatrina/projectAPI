const { Ticket } = require('../../models');

const getTicketService = async (ticketId) => {
    const ticket = await Ticket.findById(ticketId)
        .populate('eventId', 'title description startDate endDate organizerId')
        .populate('bookingId', 'bookingReference status contactInfo');

    if (!ticket) {
        return { status: 404, response: { success: false, message: 'Ticket not found' } };
    }

    return { status: 200, response: { success: true, data: ticket } };
};

module.exports = getTicketService;
