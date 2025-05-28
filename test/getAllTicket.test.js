const getAllTickets = require('../controllers/tickets/getAllTickets');
const { Ticket } = require('../models');

jest.mock('../models', () => ({
  Ticket: {
    find: jest.fn(),
    countDocuments: jest.fn(),
  },
}));

describe('getAllTickets', () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {
        eventId: 'event123',
        status: 'available',
        page: '1',
        limit: '5',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it('повертає список квитків з пагінацією', async () => {
    const fakeTickets = [
      { _id: 't1', eventId: {}, bookingId: {} },
      { _id: 't2', eventId: {}, bookingId: {} },
    ];

    const mockPopulate = jest.fn().mockReturnThis();
    const mockSort = jest.fn().mockReturnThis();
    const mockSkip = jest.fn().mockReturnThis();
    const mockLimit = jest.fn().mockResolvedValue(fakeTickets);

    Ticket.find.mockReturnValue({
      populate: mockPopulate,
      sort: mockSort,
      skip: mockSkip,
      limit: mockLimit,
    });

    Ticket.countDocuments.mockResolvedValue(8);

    await getAllTickets(req, res);

    expect(Ticket.find).toHaveBeenCalledWith({
      eventId: 'event123',
      status: 'available',
    });

    expect(mockPopulate).toHaveBeenCalledWith('eventId', 'title startDate endDate');
    expect(mockPopulate).toHaveBeenCalledWith('bookingId', 'bookingReference status');

    expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(mockSkip).toHaveBeenCalledWith(0); // page 1
    expect(mockLimit).toHaveBeenCalledWith(5);

    expect(Ticket.countDocuments).toHaveBeenCalledWith({
      eventId: 'event123',
      status: 'available',
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {
        tickets: fakeTickets,
        pagination: {
          current: 1,
          total: 2,
          count: 2,
          totalTickets: 8,
        },
      },
    });
  });

  it('працює без параметрів фільтра', async () => {
    req.query = {};

    const fakeTickets = [{ _id: 't1' }, { _id: 't2' }];
    const mockPopulate = jest.fn().mockReturnThis();
    const mockSort = jest.fn().mockReturnThis();
    const mockSkip = jest.fn().mockReturnThis();
    const mockLimit = jest.fn().mockResolvedValue(fakeTickets);

    Ticket.find.mockReturnValue({
      populate: mockPopulate,
      sort: mockSort,
      skip: mockSkip,
      limit: mockLimit,
    });

    Ticket.countDocuments.mockResolvedValue(2);

    await getAllTickets(req, res);

    expect(Ticket.find).toHaveBeenCalledWith({});
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          tickets: fakeTickets,
        }),
      })
    );
  });
});
