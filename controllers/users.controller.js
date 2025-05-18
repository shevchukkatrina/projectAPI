const usersService = require('../service/users');

const getAllUsers = async (req, res) => {
  const users = await usersService.getAllUsers();

  res.json({ users });
};

const getUser = async (req, res) => {
  const id = req.params.id;
  const user = await usersService.getUser(id);
  res.json({ user });
};

const createUser = async (req, res) => {
  const { body } = req;
  console.log(body);
  const user = await usersService.createUser(body);
  res.status(201).json({ user });
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const result = await usersService.updateUser(id, req.body);
  res.json({ user: result });
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const result = await usersService.deleteUser(id);
  res.status(204).send();
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
