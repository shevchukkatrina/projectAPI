const mongoose = require('mongoose');
const updateEvent = require('../controllers/events/updateEvent');
const { Event, User } = require('../models');

jest.mock('../models', () => ({
  Event: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
  User: {
    findById: jest.fn(),
  },
}));

describe('updateEvent controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: new mongoose.Types.ObjectId().toString() },
      body: {},
      user: { id: new mongoose.Types.ObjectId().toString() },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it('повертає 400 для невалідного ObjectId', async () => {
    req.params.id = 'invalid-id';

    await updateEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid event ID format',
    });
  });

  it('повертає 404 якщо подію не знайдено', async () => {
    Event.findById.mockResolvedValue(null);

    await updateEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Event not found',
    });
  });

  it('повертає 401 якщо користувач не знайдений', async () => {
    Event.findById.mockResolvedValue({ organizerId: req.user.id });
    User.findById.mockResolvedValue(null);

    await updateEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Unauthorized access',
    });
  });

  it('повертає 403 якщо користувач не має доступу', async () => {
    Event.findById.mockResolvedValue({ organizerId: 'other-id' });
    User.findById.mockResolvedValue({ role: 'organizer', _id: req.user.id });

    await updateEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'You do not have permission to update this event',
    });
  });

  it('повертає 400 якщо totalTickets менше проданих квитків', async () => {
    Event.findById.mockResolvedValue({
      organizerId: req.user.id,
      totalTickets: 100,
      availableTickets: 90,
    });
    User.findById.mockResolvedValue({ role: 'organizer', _id: req.user.id });

    req.body.totalTickets = 5;

    await updateEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Cannot reduce total tickets below the number of sold tickets',
    });
  });

  it('успішно оновлює подію', async () => {
    const event = {
      organizerId: req.user.id,
      totalTickets: 100,
      availableTickets: 80,
      startDate: new Date(),
      endDate: new Date(Date.now() + 10000),
    };

    Event.findById.mockResolvedValue(event);
    User.findById.mockResolvedValue({ role: 'organizer', _id: req.user.id });

    req.body = {
      title: 'Updated Event',
      totalTickets: 120,
      status: 'active',
    };

    const updatedEventMock = { ...event, title: 'Updated Event', totalTickets: 120 };

    Event.findByIdAndUpdate.mockResolvedValue(updatedEventMock);

    await updateEvent(req, res);

    expect(Event.findByIdAndUpdate).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Event updated successfully',
      data: updatedEventMock,
    });
  });

  it('повертає 400 для невалідного статусу', async () => {
    Event.findById.mockResolvedValue({ organizerId: req.user.id });
    User.findById.mockResolvedValue({ role: 'admin', _id: req.user.id });

    req.body.status = 'invalid-status';

    await updateEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid status value',
    });
  });

  it('повертає 500 при внутрішній помилці сервера', async () => {
    Event.findById.mockRejectedValue(new Error('DB error'));

    await updateEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Server error while updating event',
    });
  });
});
