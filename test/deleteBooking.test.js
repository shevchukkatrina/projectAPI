const deleteBooking = require('../controllers/bookings/deleteBooking');
const { Booking, Ticket, Event } = require('../models');

// Мокаємо моделі
jest.mock('../models', () => ({
  Booking: {
    findById: jest.fn(),
  },
  Ticket: {
    find: jest.fn(),
    countDocuments: jest.fn(),
  },
  Event: {
    findById: jest.fn(),
  },
}));

describe('deleteBooking', () => {
  let req, res;
  const userId = 'user123';
  const bookingId = 'booking123';

  beforeEach(() => {
    req = {
      params: { id: bookingId },
      user: { _id: userId, role: 'user' },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it('повертає 404, якщо бронювання не знайдено', async () => {
    Booking.findById.mockResolvedValue(null);

    await deleteBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Booking not found',
      })
    );
  });

  it('повертає 403, якщо користувач не власник і не адміністратор', async () => {
    const booking = {
      userId: { toString: () => 'anotherUser' }, // <-- об'єкт з toString()
      canBeCancelled: () => true,
      cancel: () => true,
      ticketId: [],
    };
    Booking.findById.mockResolvedValue(booking);

    await deleteBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Unauthorized to delete this booking',
      })
    );
  });

  it('повертає 400, якщо бронювання не можна скасувати', async () => {
    const booking = {
      userId: { toString: () => userId }, // <-- об'єкт з toString()
      canBeCancelled: () => false,
    };
    Booking.findById.mockResolvedValue(booking);

    await deleteBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.stringContaining('cannot be cancelled'),
      })
    );
  });

  it('повертає 400, якщо не вдалося скасувати', async () => {
    const booking = {
      userId: { toString: () => userId }, // <-- об'єкт з toString()
      canBeCancelled: () => true,
      cancel: () => false,
    };
    Booking.findById.mockResolvedValue(booking);

    await deleteBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Unable to cancel booking',
      })
    );
  });

  it('скасовує бронювання успішно', async () => {
    const ticket1 = { _id: 't1', release: jest.fn(), save: jest.fn() };
    const event = {
      availableTickets: 0,
      save: jest.fn(),
    };

    const booking = {
      _id: bookingId,
      userId: { toString: () => userId }, // <-- об'єкт з toString()
      eventId: 'event123',
      ticketId: ['t1'],
      canBeCancelled: () => true,
      cancel: () => true,
      save: jest.fn(),
    };

    Booking.findById.mockResolvedValue(booking);
    Ticket.find.mockResolvedValue([ticket1]);
    Event.findById.mockResolvedValue(event);
    Ticket.countDocuments.mockResolvedValue(5);

    await deleteBooking(req, res);

    expect(booking.save).toHaveBeenCalled();
    expect(ticket1.release).toHaveBeenCalled();
    expect(ticket1.save).toHaveBeenCalled();
    expect(event.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: 'Booking cancelled successfully',
        data: booking,
      })
    );
  });
});
