const { controllerWrapper } = require("../../utils");

const login = require("./login");

module.exports = {
  login: controllerWrapper(login),
};
