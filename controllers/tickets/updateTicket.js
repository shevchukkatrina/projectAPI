const updateTicketService = require('../../service/tickets/updateTicketService');

const updateTicket = async (req, res) => {
    const result = await updateTicketService(req.params.id, req.body);
    res.status(result.status).json(result.response);
};

module.exports = updateTicket;
