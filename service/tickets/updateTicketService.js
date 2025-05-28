const { Ticket, Event } = require('../../models');

const updateTicketService = async (ticketId, { status }) => {
    if (!status || !['available', 'reserved', 'sold', 'cancelled'].includes(status)) {
        return {
            status: 400,
            response: {
                success: false,
                message: 'Valid status is required (available, reserved, sold, cancelled)',
            },
        };
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
        return { status: 404, response: { success: false, message: 'Ticket not found' } };
    }

    const oldStatus = ticket.status;
    let updated = false;

    switch (status) {
        case 'available':
            updated = ticket.release();
            break;
        case 'sold':
            updated = ticket.confirmSale();
            break;
        case 'cancelled':
            ticket.status = 'cancelled';
            ticket.bookingId = null;
            ticket.reservationExpiry = null;
            updated = true;
            break;
        default:
            return {
                status: 400,
                response: {
                    success: false,
                    message: 'Cannot directly set status to reserved. Use booking process.',
                },
            };
    }

    if (!updated) {
        return {
            status: 400,
            response: {
                success: false,
                message: `Cannot change ticket status from ${oldStatus} to ${status}`,
            },
        };
    }

    await ticket.save();

    if (oldStatus !== status) {
        const event = await Event.findById(ticket.eventId);
        if (event) {
            const availableCount = await Ticket.countDocuments({
                eventId: ticket.eventId,
                status: 'available',
            });
            event.availableTickets = availableCount;
            await event.save();
        }
    }

    return {
        status: 200,
        response: {
            success: true,
            message: 'Ticket updated successfully',
            data: ticket,
        },
    };
};

module.exports = updateTicketService;
