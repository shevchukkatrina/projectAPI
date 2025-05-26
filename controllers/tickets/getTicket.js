const { Ticket } = require('../../models');

const getTicket = async (req, res) => {
    const { id: ticketId } = req.params;

    const ticket = await Ticket.findById(ticketId)
        .populate('eventId', 'title description startDate endDate organizerId')
        .populate('bookingId', 'bookingReference status contactInfo');

    if (!ticket) {
        return res.status(404).json({
            success: false,
            message: 'Ticket not found',
        });
    }

    return res.status(200).json({
        success: true,
        data: ticket,
    });
};

module.exports = getTicket;
