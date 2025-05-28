const mongoose = require('mongoose');
const findEventById = require('../controllers/events/findElementByid');
const { Event } = require('../models');

jest.mock('../models', () => ({
  Event: {
    findById: jest.fn(),
  },
}));

describe('findEventById controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: '60c72b2f9b1d8b35d8fef123' },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it('повертає 400 для невалідного ObjectId', async () => {
    req.params.id = 'invalid-id';

    await findEventById(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid event ID format',
    });
  });

  it('повертає 404 якщо подію не знайдено', async () => {
    const mockPopulate = jest.fn().mockResolvedValue(null);
    Event.findById.mockReturnValue({ populate: mockPopulate });

    await findEventById(req, res);

    expect(Event.findById).toHaveBeenCalledWith(req.params.id);
    expect(mockPopulate).toHaveBeenCalledWith({
      path: 'tickets',
      match: { status: 'available' },
      select: 'type price section row seat',
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Event not found',
    });
  });

  it('повертає 500 при помилці сервера', async () => {
    const mockPopulate = jest.fn().mockRejectedValue(new Error('DB error'));
    Event.findById.mockReturnValue({ populate: mockPopulate });

    await findEventById(req, res);

    expect(Event.findById).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Server error while fetching event',
    });
  });

  it('успішно повертає подію з розрахованими полями та ticketSummary', async () => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const eventMock = {
      _id: req.params.id,
      title: 'Test Event',
      startDate: futureDate,
      endDate: new Date(futureDate.getTime() + 2 * 60 * 60 * 1000),
      availableTickets: 5,
      tickets: [
        { type: 'VIP', price: 200, section: 'A', row: '1', seat: '1' },
        { type: 'VIP', price: 180, section: 'A', row: '1', seat: '2' },
        { type: 'Standard', price: 50, section: 'B', row: '3', seat: '10' },
      ],
      toObject: function () {
        return { ...this };
      },
    };

    const mockPopulate = jest.fn().mockResolvedValue(eventMock);
    Event.findById.mockReturnValue({ populate: mockPopulate });

    await findEventById(req, res);

    expect(Event.findById).toHaveBeenCalledWith(req.params.id);
    expect(mockPopulate).toHaveBeenCalledWith({
      path: 'tickets',
      match: { status: 'available' },
      select: 'type price section row seat',
    });

    expect(res.status).toHaveBeenCalledWith(200);
    const data = res.json.mock.calls[0][0].data;

    expect(data).toMatchObject({
      title: 'Test Event',
      isPast: false,
      isComing: true,
      isOngoing: false,
      isSoldOut: false,
      daysUntilEvent: expect.any(Number),
      ticketSummary: {
        VIP: {
          count: 2,
          minPrice: 180,
          maxPrice: 200,
        },
        Standard: {
          count: 1,
          minPrice: 50,
          maxPrice: 50,
        },
      },
    });
  });

  it('видаляє tickets якщо їх більше 20', async () => {
    const tickets = Array.from({ length: 21 }, (_, i) => ({
      type: 'Standard',
      price: 10 + i,
      section: 'A',
      row: '1',
      seat: `${i + 1}`,
    }));

    const eventMock = {
      _id: req.params.id,
      title: 'Massive Event',
      startDate: new Date(Date.now() + 86400000),
      endDate: new Date(Date.now() + 2 * 86400000),
      availableTickets: 100,
      tickets,
      toObject: function () {
        return { ...this };
      },
    };

    const mockPopulate = jest.fn().mockResolvedValue(eventMock);
    Event.findById.mockReturnValue({ populate: mockPopulate });

    await findEventById(req, res);

    const data = res.json.mock.calls[0][0].data;

    expect(data.tickets).toBeUndefined();
    expect(data.ticketsCount).toBe(21);
  });
});
