const login = require('../controllers/auth/login');
const { authService } = require('../service');

jest.mock('../service', () => ({
  authService: {
    authenticateUser: jest.fn(),
  },
}));

describe('login controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it('повертає 400, якщо відсутні email або password', async () => {
    req.body = { email: 'test@example.com' }; // без пароля

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Please provide all required fields',
    });
  });

  it('повертає помилку, якщо authService не знайшов користувача', async () => {
    authService.authenticateUser.mockResolvedValue(null);

    await login(req, res);

    // тут логіка залежить від реалізації authService: або просто поверне null, або кине помилку
    // Припустимо, що authService обробляє помилку всередині та повертає null

    expect(authService.authenticateUser).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(res.json).toHaveBeenCalledWith({ user: null });
  });

  it('повертає користувача, якщо автентифікація успішна', async () => {
    const fakeUser = {
      _id: 'user123',
      email: 'test@example.com',
      name: 'Test User',
    };

    authService.authenticateUser.mockResolvedValue(fakeUser);

    await login(req, res);

    expect(authService.authenticateUser).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(res.json).toHaveBeenCalledWith({ user: fakeUser });
  });
});
