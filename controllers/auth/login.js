const { authService } = require("../../service");

const login = async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((value) => value === undefined)) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }

  const user = await authService.authenticateUser(email, password);

  res.json({ user });
};

module.exports = login;
