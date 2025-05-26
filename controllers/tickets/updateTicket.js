const { ticketsService } = require('../../service');

const updateTicket = async (req, res) => {
    try {
        const { id, ticket_code, event_id, booking_id } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'ID is required' });
        }

        const updatedTicket = await ticketsService.updateTicket(id, {
            ticket_code,
            event_id,
            booking_id,
        });

        if (!updatedTicket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        res.json(updatedTicket);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = updateTicket;
