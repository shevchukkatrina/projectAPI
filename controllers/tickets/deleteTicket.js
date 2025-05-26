const { Event, Ticket } = require('../../models');

const deleteTicket = async (req, res) => {
    const { id: ticketId } = req.params;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
        return res.status(404).json({
            success: false,
            message: 'Ticket not found',
        });
    }

    if (ticket.status !== 'available') {
        return res.status(400).json({
            success: false,
            message: 'Cannot delete ticket that is reserved or sold',
        });
    }

    const event = await Event.findById(ticket.eventId);
    if (event) {
        event.tickets.pull(ticketId);
        event.availableTickets = Math.max(0, event.availableTickets - 1);
        event.totalTickets = Math.max(0, event.totalTickets - 1);
        await event.save();
    }

    await Ticket.findByIdAndDelete(ticketId);

    return res.status(200).json({
        success: true,
        message: 'Ticket deleted successfully',
    });
};

module.exports = deleteTicket;
