const { Event } = require('../db/models/event.model');

const getAllEvents = async () => {
  const events = await Event.find();
  return events;
};

const getEvent = async (id) => {
  const event = await Event.findById(id);
  return event;
};

const createEvent = async (data) => {
  const newEvent = await Event.create(data);
  return newEvent;
};

const updateEvent = async (eventId, data) => {
  const updatedEvent = await Event.findOneAndUpdate({ _id: eventId }, data, {
    new: true,
  });
  return updatedEvent;
};

const deleteEvent = async (eventId) => {
  await Event.findOneAndDelete({ _id: eventId });
};

const getAvailableTickets = async (eventId) => {
  const event = await Event.findById(eventId);
  if (!event) return null;
  console.log(event)
  return event.available_tickets;
};

module.exports = {
  getAllEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getAvailableTickets,
};
