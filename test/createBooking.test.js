const createBooking = require('../controllers/bookings/createBooking');
const { Event, Ticket, Booking } = require('../models/index');

// Мокаємо Mongoose-моделі
jest.mock('../models/index', () => ({
  Event: {
    findById: jest.fn(),
    countDocuments: jest.fn(),
  },
  Ticket: {
    find: jest.fn(),
    countDocuments: jest.fn(), // ДОДАНО
  },
  Booking: jest.fn(() => ({
    save: jest.fn(),
  })),
}));

describe('createBooking', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        eventId: 'event123',
        ticketQuantity: 1,
        contactInfo: { phone: '123456' },
      },
      user: { _id: 'user123' },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it('повертає 400, якщо немає eventId', async () => {
    req.body.eventId = null;

    await createBooking(req, res);

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

    await createBooking(req, res);

    expect(Event.findById).toHaveBeenCalledWith('event123');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Event not found',
      })
    );
  });

  it('повертає 400, якщо подія недоступна', async () => {
    const fakeEvent = { isAvailable: () => false };
    Event.findById.mockResolvedValue(fakeEvent);

    await createBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Event is not available for booking',
      })
    );
  });

  it('повертає 400, якщо не вистачає квитків', async () => {
    const fakeEvent = { isAvailable: () => true };
    Event.findById.mockResolvedValue(fakeEvent);
    Ticket.find.mockReturnValue({
      limit: () => Promise.resolve([]),
    });

    await createBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.stringMatching(/Only 0 tickets available/),
      })
    );
  });

  it('створює бронювання успішно', async () => {
    const fakeEvent = {
      _id: 'event123',
      isAvailable: () => true,
      save: jest.fn(),
    };

    const fakeTicket = {
      _id: 'ticket1',
      reserve: jest.fn(() => true),
      save: jest.fn(),
    };

    const fakeBooking = {
      _id: 'booking123',
      save: jest.fn(),
      ticketId: [],
    };

    Event.findById.mockResolvedValue(fakeEvent);
    Ticket.find.mockReturnValue({ limit: () => Promise.resolve([fakeTicket]) });
    Ticket.countDocuments.mockResolvedValue(3); // ДОДАНО
    Booking.mockImplementation(() => fakeBooking);

    // Мок для ланцюга populate().populate().populate()
    Booking.findById = jest.fn(() => ({
      populate: jest.fn(() => ({
        populate: jest.fn(() => ({
          populate: jest.fn(() =>
            Promise.resolve({
              _id: 'booking123',
              eventId: { title: 'Test Event' },
              userId: { name: 'Test User' },
              ticketId: [fakeTicket],
            })
          ),
        })),
      })),
    }));

    await createBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: 'Booking created successfully',
        data: expect.any(Object),
      })
    );
  });
});
