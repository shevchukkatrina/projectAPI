const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const performanceMiddleware = require('./middlewares/performance');
const requestStatsMiddleware = require('./middlewares/requestStats');
require('dotenv').config();

const rootRouter = require('./routes');
const initMongoDB = require('./db/initMongoDB');
const notFoundMiddleware = require('./middlewares/notFound');
const errorHandlerMiddleware = require('./middlewares/errorHandler');
const setupSwagger = require('./swagger'); // ✅ Ось твоя готова обгортка

try {
  initMongoDB();
} catch (error) {
  console.log('Error while init Mongo database');
  console.error(error);
  process.exit(1);
}

const app = express();
setupSwagger(app); // ✅ Залишити тільки цей виклик

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// middlewares
app.use(performanceMiddleware);
app.use(requestStatsMiddleware);

// router
app.use('/', rootRouter);

// catch 404 and forward to error handler
app.use(notFoundMiddleware);

// error handler
app.use(errorHandlerMiddleware);

module.exports = app;
