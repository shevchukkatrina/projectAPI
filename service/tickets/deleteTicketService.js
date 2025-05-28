const { Event, Ticket } = require('../../models');

const deleteTicketService = async (ticketId) => {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
        return { status: 404, response: { success: false, message: 'Ticket not found' } };
    }

    if (ticket.status !== 'available') {
        return { status: 400, response: { success: false, message: 'Cannot delete ticket that is reserved or sold' } };
    }

    const event = await Event.findById(ticket.eventId);
    if (event) {
        event.tickets.pull(ticketId);
        event.availableTickets = Math.max(0, event.availableTickets - 1);
        event.totalTickets = Math.max(0, event.totalTickets - 1);
        await event.save();
    }

    await Ticket.findByIdAndDelete(ticketId);

    return { status: 200, response: { success: true, message: 'Ticket deleted successfully' } };
};

module.exports = deleteTicketService;
