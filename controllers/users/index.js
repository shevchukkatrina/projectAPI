const controllerWrapper = require("../../utils/controllerWrapper");

const getUser = require("./getUser");
const createUser = require("./createUser");
const updateUser = require("./updateUser");
const deleteUser = require("./deleteUser");
const getAllUsers = require("./getAllUsers");

module.exports = {
  getUser: controllerWrapper(getUser),
  createUser: controllerWrapper(createUser),
  updateUser: controllerWrapper(updateUser),
  deleteUser: controllerWrapper(deleteUser),
  getAllUsers: controllerWrapper(getAllUsers),
};
