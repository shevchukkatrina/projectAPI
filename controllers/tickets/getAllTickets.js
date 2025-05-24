const { ticketsService } = require("../../service");

const getAllTickets = async (req, res) => {
  try {
    const tickets = await ticketsService.getAllTickets();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = getAllTickets;
