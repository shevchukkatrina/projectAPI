const deleteTicketService = require('../../service/tickets/deleteTicketService');

const deleteTicket = async (req, res) => {
    const result = await deleteTicketService(req.params.id);
    res.status(result.status).json(result.response);
};

module.exports = deleteTicket;
