const controllerWrapper = require("../../utils/controllerWrapper");

const createTicket = require("./createTicket");
const deleteTicket = require("./deleteTicket");
const getAllTickets = require("./getAllTickets");
const getTicket = require("./getTicket");
const updateTicket = require("./updateTicket");

module.exports = {
  createTicket: controllerWrapper(createTicket),
  deleteTicket: controllerWrapper(deleteTicket),
  getAllTickets: controllerWrapper(getAllTickets),
  getTicket: controllerWrapper(getTicket),
  updateTicket: controllerWrapper(updateTicket),
};
