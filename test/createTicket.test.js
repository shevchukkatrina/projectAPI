const createTicket = require('../controllers/tickets/createTicket');
const { Event, Ticket } = require('../models');

jest.mock('../models', () => {
  const insertMany = jest.fn();
  const Ticket = function (data) {
    return data; // або можна додати більше логіки/моків тут
  };
  Ticket.insertMany = insertMany;

  return {
    Event: {
      findById: jest.fn(),
    },
    Ticket,
  };
});

describe('createTicket', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        eventId: 'event123',
        quantity: 2,
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it('повертає 400, якщо немає eventId', async () => {
    req.body.eventId = null;

    await createTicket(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Event ID is required',
      })
    );
  });

  it('повертає 404, якщо подію не знайдено', async () => {
    Event.findById.mockResolvedValue(null);

    await createTicket(req, res);

    expect(Event.findById).toHaveBeenCalledWith('event123');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Event not found',
      })
    );
  });

  it('повертає 400, якщо подія не активна', async () => {
    const fakeEvent = { status: 'inactive' };
    Event.findById.mockResolvedValue(fakeEvent);

    await createTicket(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Cannot create tickets for inactive event',
      })
    );
  });

  it('створює квитки успішно', async () => {
    const fakeEvent = {
      _id: 'event123',
      status: 'active',
      tickets: [],
      availableTickets: 0,
      totalTickets: 0,
      save: jest.fn(),
    };

    const fakeTickets = [
      { _id: 'ticket1', eventId: 'event123', status: 'available' },
      { _id: 'ticket2', eventId: 'event123', status: 'available' },
    ];

    Event.findById.mockResolvedValue(fakeEvent);
    Ticket.insertMany.mockResolvedValue(fakeTickets);

    await createTicket(req, res);

    expect(Ticket.insertMany).toHaveBeenCalledTimes(1);
    expect(fakeEvent.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: '2 tickets created successfully',
        data: {
          tickets: fakeTickets,
          eventId: fakeEvent._id,
          totalCreated: 2,
        },
      })
    );
  });
});
