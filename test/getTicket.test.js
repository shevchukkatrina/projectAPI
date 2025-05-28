const getTicket = require('../controllers/tickets/getTicket');
const { Ticket } = require('../models');

jest.mock('../models', () => ({
  Ticket: {
    findById: jest.fn(),
  },
}));

describe('getTicket', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: 'ticket123' },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it('повертає 404, якщо квиток не знайдено', async () => {
    const mockPopulate = jest.fn().mockReturnThis();
    Ticket.findById.mockReturnValueOnce({ populate: mockPopulate });
    mockPopulate.mockReturnValueOnce({ populate: mockPopulate });
    mockPopulate.mockResolvedValueOnce(null);

    await getTicket(req, res);

    expect(Ticket.findById).toHaveBeenCalledWith('ticket123');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Ticket not found',
    });
  });

  it('повертає 200 і дані квитка, якщо знайдено', async () => {
    const fakeTicket = {
      _id: 'ticket123',
      eventId: {
        _id: 'event123',
        title: 'Concert',
        description: 'Awesome show',
        startDate: '2025-07-01',
        endDate: '2025-07-02',
        organizerId: 'user1',
      },
      bookingId: {
        bookingReference: 'ABC123',
        status: 'confirmed',
        contactInfo: 'email@example.com',
      },
    };

    const mockPopulate = jest.fn().mockReturnThis();
    Ticket.findById.mockReturnValueOnce({ populate: mockPopulate });
    mockPopulate.mockReturnValueOnce({ populate: mockPopulate }).mockResolvedValueOnce(fakeTicket);

    await getTicket(req, res);

    expect(Ticket.findById).toHaveBeenCalledWith('ticket123');
    expect(mockPopulate).toHaveBeenCalledWith('eventId', 'title description startDate endDate organizerId');
    expect(mockPopulate).toHaveBeenCalledWith('bookingId', 'bookingReference status contactInfo');

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: fakeTicket,
    });
  });
});
