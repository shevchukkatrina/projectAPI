const createHttpError = require("http-errors");
const { Session, User } = require("../models");

const authenticate = async (req, res, next) => {
  const header = req.get("Authorization");

  if (!header) {
    return next(createHttpError(401, "Auth header is not provided!"));
  }

  const [bearer, token] = header.split(" ");

  if (bearer !== "Bearer" || !token) {
    return next(createHttpError(401, "Auth header should be of bearer type"));
  }

  const session = await Session.findOne({ token });

  if (!session) {
    return next(createHttpError(401, "Session not found!"));
  }

  const user = await User.findById(session.userId);

  if (!user) {
    return next(
      createHttpError(401, "User associated with this session in not found!")
    );
  }

  req.user = user;

  return next();
};

module.exports = authenticate;
