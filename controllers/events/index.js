const { controllerWrapper } = require('../../utils');

const createEvent = require('./creteEvent');
const deleteEvent = require('./deleteEvent');
const findAllEvents = require('./findAllEvents');
const findElementById = require('./findElementById');
const updateEvent = require('./updateEvent');

module.exports = {
    createEvent: controllerWrapper(createEvent),
    findAllEvents: controllerWrapper(findAllEvents),
    findElementById: controllerWrapper(findElementById),
    updateEvent: controllerWrapper(updateEvent),
    deleteEvent: controllerWrapper(deleteEvent),
};
