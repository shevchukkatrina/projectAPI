const controllerWrapper = require('../../utils/controllerWrapper');

module.exports = {
    createTicket: controllerWrapper(require('./createTicket')),
    deleteTicket: controllerWrapper(require('./deleteTicket')),
    getAllTickets: controllerWrapper(require('./getAllTickets')),
    getTicket: controllerWrapper(require('./getTicket')),
    updateTicket: controllerWrapper(require('./updateTicket')),
};
