const getAllBookings = require('../controllers/bookings/getAllBookings');
const { Booking } = require('../models');

// Мокаємо модель
jest.mock('../models', () => ({
  Booking: {
    find: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue([]),
    countDocuments: jest.fn(),
  },
}));

describe('getAllBookings', () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {
        page: 1,
        limit: 10,
      },
      user: {
        _id: 'user123',
        role: 'user',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it('повертає 403, якщо звичайний користувач намагається отримати чужі бронювання', async () => {
    req.query.userId = 'anotherUser';

    await getAllBookings(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Unauthorized to view other users bookings',
    });
  });

  it('повертає бронювання користувача, якщо userId === req.user._id', async () => {
    req.query.userId = 'user123';
    Booking.limit.mockResolvedValue(['booking1']);
    Booking.countDocuments.mockResolvedValue(1);

    await getAllBookings(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          bookings: ['booking1'],
          pagination: expect.objectContaining({
            current: 1,
            total: 1,
            count: 1,
            totalBookings: 1,
          }),
        }),
      })
    );
  });

  it('адміністратор може переглядати бронювання будь-якого користувача', async () => {
    req.user.role = 'admin';
    req.query.userId = 'anotherUser';
    Booking.limit.mockResolvedValue(['booking1']);
    Booking.countDocuments.mockResolvedValue(1);

    await getAllBookings(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.any(Object),
      })
    );
  });

  it('повертає всі бронювання для поточного користувача, якщо не вказано userId', async () => {
    Booking.limit.mockResolvedValue(['booking1', 'booking2']);
    Booking.countDocuments.mockResolvedValue(2);

    await getAllBookings(req, res);

    expect(Booking.find).toHaveBeenCalledWith({ userId: 'user123' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          bookings: ['booking1', 'booking2'],
        }),
      })
    );
  });
});
