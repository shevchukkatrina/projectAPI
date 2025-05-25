const { controllerWrapper } = require("../../utils");

const login = require("./login");
const logout = require("./logout");

module.exports = {
  login: controllerWrapper(login),
  logout: controllerWrapper(logout),
};
