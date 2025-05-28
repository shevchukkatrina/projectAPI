const updateBooking = require('../controllers/bookings/updateBooking');
const { Booking, Ticket, Event } = require('../models');

describe('updateBooking controller', () => {
  let req, res;

  const bookingMock = {
    _id: 'bookingId',
    userId: 'user123',
    eventId: 'event123',
    ticketId: ['ticket1', 'ticket2'],
    contactInfo: { phone: '1234567890' },
    status: 'pending',
    confirm: jest.fn(() => true),
    cancel: jest.fn(() => true),
    complete: jest.fn(() => true),
    save: jest.fn(),
  };

  const ticketMock = {
    _id: 'ticket1',
    confirmSale: jest.fn(),
    release: jest.fn(),
    save: jest.fn(),
  };

  const eventMock = {
    _id: 'event123',
    availableTickets: 100,
    save: jest.fn(),
  };

  const mockPopulatedBooking = {
    _id: 'bookingId',
    eventId: { title: 'Test Event', startDate: '2025-01-01', endDate: '2025-01-02' },
    ticketId: [],
    userId: { name: 'John Doe', email: 'john@example.com' },
  };

  beforeEach(() => {
    req = {
      params: { id: 'bookingId' },
      body: {},
      user: { _id: 'user123', role: 'user' },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Reset mocks
    bookingMock.confirm.mockClear();
    bookingMock.cancel.mockClear();
    bookingMock.complete.mockClear();
    bookingMock.save.mockClear();
    ticketMock.confirmSale.mockClear();
    ticketMock.release.mockClear();
    ticketMock.save.mockClear();
    eventMock.save.mockClear();

    Booking.findById = jest
      .fn()
      .mockResolvedValueOnce(bookingMock)
      .mockReturnValue({
        populate: () => ({
          populate: () => ({
            populate: () => Promise.resolve(mockPopulatedBooking),
          }),
        }),
      });

    // Default mocks throw to avoid unexpected calls
    Ticket.find = jest.fn(() => {
      throw new Error('Ticket.find should not be called in this test');
    });

    Ticket.countDocuments = jest.fn(() => {
      throw new Error('Ticket.countDocuments should not be called in this test');
    });

    Event.findById = jest.fn(() => {
      throw new Error('Event.findById should not be called in this test');
    });
  });

  it('should update contactInfo without status change', async () => {
    req.body.contactInfo = { phone: '9999999999' };

    await updateBooking(req, res);

    expect(bookingMock.contactInfo.phone).toBe('9999999999');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: 'Booking updated successfully',
        data: mockPopulatedBooking,
      })
    );
  });

  it('should confirm booking and update tickets and event', async () => {
    req.body.status = 'confirmed';

    Ticket.find = jest.fn().mockResolvedValue([ticketMock, ticketMock]);
    Ticket.countDocuments = jest.fn().mockResolvedValue(10);
    Event.findById = jest.fn().mockResolvedValue(eventMock);

    await updateBooking(req, res);

    expect(bookingMock.confirm).toHaveBeenCalled();
    expect(ticketMock.confirmSale).toHaveBeenCalledTimes(2);
    expect(eventMock.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should cancel booking and update tickets and event', async () => {
    req.body.status = 'cancelled';

    Ticket.find = jest.fn().mockResolvedValue([ticketMock, ticketMock]);
    Ticket.countDocuments = jest.fn().mockResolvedValue(10);
    Event.findById = jest.fn().mockResolvedValue(eventMock);

    await updateBooking(req, res);

    expect(bookingMock.cancel).toHaveBeenCalled();
    expect(ticketMock.release).toHaveBeenCalledTimes(2);
    expect(eventMock.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should complete booking without ticket or event changes', async () => {
    req.body.status = 'completed';

    await updateBooking(req, res);

    expect(bookingMock.complete).toHaveBeenCalled();
    expect(ticketMock.confirmSale).not.toHaveBeenCalled();
    expect(ticketMock.release).not.toHaveBeenCalled();
    expect(eventMock.save).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should not allow unauthorized users to update', async () => {
    req.user._id = 'otherUser';
    req.user.role = 'user';

    await updateBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Unauthorized to update this booking',
    });
  });

  it('should return 404 if booking not found', async () => {
    Booking.findById = jest.fn().mockResolvedValue(null);

    await updateBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Booking not found',
    });
  });

  it('should return 400 for invalid status', async () => {
    req.body.status = 'invalidStatus';

    await updateBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid status provided',
    });
  });
});
