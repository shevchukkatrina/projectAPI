const { User } = require('../db/models/user.model');

const getAllUsers = async () => {
  const users = await User.find();
  return users;
};

const getUser = async (id) => {
  const user = await User.findById(id);
  return user;
};

const createUser = async (data) => {
  const newUser = await User.create(data);
  return newUser;
};

const updateUser = async (userId, data) => {
  const updatedUser = await User.findOneAndUpdate({ _id: userId }, data, {
    new: true,
  });
  return updatedUser;
};

const deleteUser = async (userId) => {
  const user = await User.findOneAndDelete({
    _id: userId,
  });
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
