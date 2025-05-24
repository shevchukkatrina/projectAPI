const { usersService } = require("../../service");

const createUser = async (req, res) => {
  const { body } = req;
  console.log(body);
  const user = await usersService.createUser(body);
  res.status(201).json({ user });
};

module.exports = createUser;
