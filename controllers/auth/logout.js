const { authService } = require("../../service");

const logout = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }

  const result = await authService.logout(email);

  res.json(result);
};

module.exports = logout;
