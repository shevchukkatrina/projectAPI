const { ticketsService } = require("../../service");

const deleteTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const deletedTicket = await ticketsService.deleteTicket(ticketId);
    if (!deletedTicket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    res.json({ message: "Ticket deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = deleteTicket;
