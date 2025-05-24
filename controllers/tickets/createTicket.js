const { ticketsService } = require("../../service");

const createTicket = async (req, res) => {
  try {
    const newTicket = await ticketsService.createTicket(req.body);
    res.status(201).json(newTicket);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = createTicket;
