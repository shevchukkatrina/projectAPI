const createEvent = require('../controllers/events/creteEvent');
const { Event, User } = require('../models');

// Мокаємо Mongoose-моделі
jest.mock('../models', () => ({
  Event: jest.fn(),
  User: {
    findById: jest.fn(),
  },
}));

describe('createEvent', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        title: 'Test Event',
        description: 'Test Description',
        startDate: new Date(Date.now() + 86400000).toISOString(), // завтра
        endDate: new Date(Date.now() + 172800000).toISOString(), // післязавтра
        totalTickets: 100,
      },
      user: {
        _id: 'user123',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it('повертає 400, якщо відсутні обовʼязкові поля', async () => {
    req.body.title = undefined;

    await createEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Please provide all required fields',
    });
  });

  it('повертає 400, якщо дати мають неправильний формат', async () => {
    req.body.startDate = 'invalid-date';

    await createEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid date format',
    });
  });

  it('повертає 400, якщо дата початку в минулому', async () => {
    req.body.startDate = new Date(Date.now() - 86400000).toISOString();

    await createEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Start date cannot be in the past',
    });
  });

  it('повертає 400, якщо дата завершення до або дорівнює початковій', async () => {
    const now = new Date(Date.now() + 86400000).toISOString();
    req.body.startDate = now;
    req.body.endDate = now;

    await createEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'End date must be after start date',
    });
  });

  it('повертає 404, якщо організатора не знайдено', async () => {
    User.findById.mockResolvedValue(null);

    await createEvent(req, res);

    expect(User.findById).toHaveBeenCalledWith('user123');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Organizer not found',
    });
  });

  it('створює подію успішно', async () => {
    const fakeEvent = {
      _id: 'event123',
      title: 'Test Event',
      startDate: new Date(req.body.startDate),
      totalTickets: 100,
      save: jest.fn(),
    };

    User.findById.mockResolvedValue({ _id: 'user123' });
    Event.mockImplementation(() => fakeEvent);

    await createEvent(req, res);

    expect(fakeEvent.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Event created successfully',
      data: {
        eventId: 'event123',
        title: 'Test Event',
        startDate: expect.any(Date),
        totalTickets: 100,
      },
    });
  });

  it('повертає 400, якщо виникає помилка з дублікатом', async () => {
    const fakeEvent = {
      save: jest.fn(() => {
        const err = new Error('duplicate');
        err.code = 11000;
        throw err;
      }),
    };

    User.findById.mockResolvedValue({ _id: 'user123' });
    Event.mockImplementation(() => fakeEvent);

    await createEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'An event with similar details already exists',
    });
  });

  it('повертає 400 при ValidationError', async () => {
    const fakeEvent = {
      save: jest.fn(() => {
        const err = new Error('validation');
        err.name = 'ValidationError';
        err.errors = {
          field1: { message: 'Field1 is invalid' },
          field2: { message: 'Field2 is required' },
        };
        throw err;
      }),
    };

    User.findById.mockResolvedValue({ _id: 'user123' });
    Event.mockImplementation(() => fakeEvent);

    await createEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Field1 is invalid, Field2 is required',
    });
  });

  it('повертає 500 при невідомій помилці', async () => {
    const fakeEvent = {
      save: jest.fn(() => {
        throw new Error('Unexpected');
      }),
    };

    User.findById.mockResolvedValue({ _id: 'user123' });
    Event.mockImplementation(() => fakeEvent);

    await createEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Server error while creating event',
    });
  });
});
