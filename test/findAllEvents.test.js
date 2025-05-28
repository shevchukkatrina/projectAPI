const findAllEvents = require('../controllers/events/findAllEvents');
const { Event } = require('../models');

jest.mock('../models', () => ({
  Event: {
    find: jest.fn(),
    countDocuments: jest.fn(),
  },
}));

function mockFindChain(returnData = []) {
  const mockSort = jest.fn().mockReturnThis();
  const mockSkip = jest.fn().mockReturnThis();
  const mockLimit = jest.fn().mockReturnThis();
  const mockLean = jest.fn().mockResolvedValue(returnData);

  Event.find.mockReturnValue({
    sort: mockSort,
    skip: mockSkip,
    limit: mockLimit,
    lean: mockLean,
  });

  return { mockSort, mockSkip, mockLimit, mockLean };
}

describe('findAllEvents controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Event.find.mockReset();
    Event.countDocuments.mockReset();
  });

  it('повертає активні події за замовчуванням', async () => {
    const mockEvents = [{ title: 'Test Event 1' }];
    mockFindChain(mockEvents);
    Event.countDocuments.mockResolvedValue(1);

    await findAllEvents(req, res);

    expect(Event.find).toHaveBeenCalledWith({ status: 'active' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      data: mockEvents,
      pagination: expect.any(Object),
    }));
  });

  it('фільтрує за статусом, організатором та датами', async () => {
    req.query = {
      status: 'cancelled',
      organizerId: 'org123',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    };

    mockFindChain([]);
    Event.countDocuments.mockResolvedValue(0);

    await findAllEvents(req, res);

    expect(Event.find).toHaveBeenCalledWith(expect.objectContaining({
      status: 'cancelled',
      organizerId: 'org123',
      startDate: { $gte: new Date('2024-01-01') },
      endDate: { $lte: new Date('2024-12-31') },
    }));
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('використовує пошук по title і description', async () => {
    req.query = {
      searchQuery: 'concert',
    };

    mockFindChain([]);
    Event.countDocuments.mockResolvedValue(0);

    await findAllEvents(req, res);

    expect(Event.find).toHaveBeenCalledWith(expect.objectContaining({
      status: 'active',
      $or: [
        { title: { $regex: 'concert', $options: 'i' } },
        { description: { $regex: 'concert', $options: 'i' } },
      ],
    }));
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('додає пагінацію та сортування', async () => {
    req.query = {
      page: '2',
      limit: '5',
      sortBy: 'title',
      sortOrder: 'desc',
    };

    const { mockSort, mockSkip, mockLimit } = mockFindChain([]);
    Event.countDocuments.mockResolvedValue(0);

    await findAllEvents(req, res);

    expect(Event.find).toHaveBeenCalledWith(expect.any(Object));
    expect(mockSort).toHaveBeenCalledWith({ title: -1 });
    expect(mockSkip).toHaveBeenCalledWith(5); // (page 2 - 1) * limit 5
    expect(mockLimit).toHaveBeenCalledWith(5);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('повертає 500 при помилці сервера', async () => {
    Event.find.mockImplementation(() => {
      throw new Error('DB error');
    });

    await findAllEvents(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      message: 'Server error while fetching events',
    }));
  });
});
