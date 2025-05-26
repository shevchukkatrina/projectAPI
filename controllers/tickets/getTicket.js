const { ticketsService } = require('../../service');

const getTicket = async (req, res) => {
    try {
        const ticket = await ticketsService.getTicket(req.params.id);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        res.json(ticket);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = getTicket;
