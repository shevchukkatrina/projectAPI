const { usersService } = require("../../service");

const updateUser = async (req, res) => {
  const { id } = req.params;
  const result = await usersService.updateUser(id, req.body);
  res.json({ user: result });
};

module.exports = updateUser;
