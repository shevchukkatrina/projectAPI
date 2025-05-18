const ticketsService = require('../service/tickets');

const getAllTickets = async (req, res) => {
  try {
    const tickets = await ticketsService.getAllTickets();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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

const createTicket = async (req, res) => {
  try {
    const newTicket = await ticketsService.createTicket(req.body);
    res.status(201).json(newTicket);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

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

const deleteTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const deletedTicket = await ticketsService.deleteTicket(ticketId);
    if (!deletedTicket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllTickets,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket,
};
