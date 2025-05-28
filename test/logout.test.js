const logout = require('../controllers/auth/logout');
const { authService } = require('../service');

jest.mock('../service', () => ({
  authService: {
    logout: jest.fn(),
  },
}));

describe('logout controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it('повертає 400, якщо немає email', async () => {
    req.body.email = undefined;

    await logout(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Please provide all required fields',
    });
  });

  it('успішно виконує logout та повертає результат', async () => {
    const mockResult = { success: true, message: 'Logged out successfully' };
    authService.logout.mockResolvedValue(mockResult);

    await logout(req, res);

    expect(authService.logout).toHaveBeenCalledWith('test@example.com');
    expect(res.json).toHaveBeenCalledWith(mockResult);
  });
});
