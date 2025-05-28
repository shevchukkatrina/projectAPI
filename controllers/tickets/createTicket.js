const createTicketService = require('../../service/tickets/createTicketService');

const createTicket = async (req, res) => {
    const result = await createTicketService(req.body);
    res.status(result.status).json(result.response);
};

module.exports = createTicket;
