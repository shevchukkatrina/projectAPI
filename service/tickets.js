const { Ticket } = require("../models");

const getAllTickets = async () => {
  const tickets = await Ticket.find();
  return tickets;
};

const getTicket = async (id) => {
  const ticket = await Ticket.findById(id);
  return ticket;
};

const createTicket = async (data) => {
  const newTicket = await Ticket.create(data);
  return newTicket;
};

const updateTicket = async (ticketId, data) => {
  const updatedTicket = await Ticket.findOneAndUpdate({ _id: ticketId }, data, {
    new: true,
  });
  return updatedTicket;
};

const deleteTicket = async (ticketId) => {
  const deletedTicket = await Ticket.findByIdAndDelete(ticketId);
  return deletedTicket;
};

module.exports = {
  getAllTickets,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket,
};
