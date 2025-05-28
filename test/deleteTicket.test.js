const deleteTicket = require('../controllers/tickets/deleteTicket');
const { Event, Ticket } = require('../models');

// Мокаємо моделі Mongoose
jest.mock('../models', () => ({
  Event: {
    findById: jest.fn(),
  },
  Ticket: {
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

describe('deleteTicket', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        id: 'ticket123',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it('повертає 404, якщо квиток не знайдено', async () => {
    Ticket.findById.mockResolvedValue(null);

    await deleteTicket(req, res);

    expect(Ticket.findById).toHaveBeenCalledWith('ticket123');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Ticket not found',
    });
  });

  it('повертає 400, якщо квиток зарезервований або проданий', async () => {
    const reservedTicket = {
      _id: 'ticket123',
      status: 'reserved',
    };
    Ticket.findById.mockResolvedValue(reservedTicket);

    await deleteTicket(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Cannot delete ticket that is reserved or sold',
    });
  });

  it('успішно видаляє квиток і оновлює подію', async () => {
    const ticket = {
      _id: 'ticket123',
      status: 'available',
      eventId: 'event123',
    };

    const fakeEvent = {
      tickets: {
        pull: jest.fn(),
      },
      availableTickets: 5,
      totalTickets: 10,
      save: jest.fn(),
    };

    Ticket.findById.mockResolvedValue(ticket);
    Event.findById.mockResolvedValue(fakeEvent);
    Ticket.findByIdAndDelete.mockResolvedValue({});

    await deleteTicket(req, res);

    expect(Event.findById).toHaveBeenCalledWith('event123');
    expect(fakeEvent.tickets.pull).toHaveBeenCalledWith('ticket123');
    expect(fakeEvent.availableTickets).toBe(4);
    expect(fakeEvent.totalTickets).toBe(9);
    expect(fakeEvent.save).toHaveBeenCalled();
    expect(Ticket.findByIdAndDelete).toHaveBeenCalledWith('ticket123');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Ticket deleted successfully',
    });
  });

  it('успішно видаляє квиток навіть якщо подію не знайдено', async () => {
    const ticket = {
      _id: 'ticket123',
      status: 'available',
      eventId: 'event123',
    };

    Ticket.findById.mockResolvedValue(ticket);
    Event.findById.mockResolvedValue(null);
    Ticket.findByIdAndDelete.mockResolvedValue({});

    await deleteTicket(req, res);

    expect(Event.findById).toHaveBeenCalledWith('event123');
    expect(Ticket.findByIdAndDelete).toHaveBeenCalledWith('ticket123');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Ticket deleted successfully',
    });
  });
});
