const getTicketService = require('../../service/tickets/getTicketService');

const getTicket = async (req, res) => {
    const result = await getTicketService(req.params.id);
    res.status(result.status).json(result.response);
};

module.exports = getTicket;
