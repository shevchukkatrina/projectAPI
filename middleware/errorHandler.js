const { isHttpError } = require("http-errors");
const { MongooseError } = require("mongoose");

const errorHandlerMiddleware = (err, req, res, next) => {
  if (isHttpError(err)) {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
      data: err.errors,
    });
    return;
  }

  if (err instanceof MongooseError) {
    res.status(500).json({
      status: err.status,
      message: "Mongoose error",
    });
    return;
  }

  res.status(500).json({
    message: "Something went wrong",
    error: err.message,
  });
};

module.exports = errorHandlerMiddleware;
