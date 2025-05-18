const eventsService = require('../service/events');

const getAllEvents = async (req, res) => {
  const events = await eventsService.getAllEvents();
  res.json({ events });
};

const getEvent = async (req, res) => {
  const { id } = req.params;
  const event = await eventsService.getEvent(id);
  res.json({ event });
};

const createEvent = async (req, res) => {
  const { body } = req;
  const event = await eventsService.createEvent(body);
  res.status(201).json({ event });
};

const updateEvent = async (req, res) => {
  const { id } = req.params;
  const updatedEvent = await eventsService.updateEvent(id, req.body);
  res.json({ event: updatedEvent });
};

const deleteEvent = async (req, res) => {
  const { id } = req.params;
  await eventsService.deleteEvent(id);
  res.status(204).send();
};

const getAvailableTickets = async (req, res) => {
  const { id } = req.params; // <-- тут правильна назва параметра
  const tickets = await eventsService.getAvailableTickets(id);
  res.json({ tickets });
};



module.exports = {
  getAllEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getAvailableTickets,
};
