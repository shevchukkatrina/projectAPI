const { usersService } = require("../../service");

const getUser = async (req, res) => {
  const id = req.params.id;
  const user = await usersService.getUser(id);
  res.json({ user });
};

module.exports = getUser;
