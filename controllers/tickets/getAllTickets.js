const getAllTicketsService = require('../../service/tickets/getAllTicketsService');

const getAllTickets = async (req, res) => {
    const result = await getAllTicketsService(req.query);
    res.status(result.status).json(result.response);
};

module.exports = getAllTickets;
