const createError = require('http-errors');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const performanceMiddleware = require('./middleware/performance');
const requestStatsMiddleware = require('./middleware/requestStats');
require('dotenv').config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const instructorsRouter = require('./routes/instructors');
const ticketsRouter = require('./routes/tickets');
const bookingRouter = require('./routes/booking')

const initMongoDB = require('./db/initMongoDB');

try {
    initMongoDB()
} catch (error) {
    console.log('Error while init Mongo database')
    console.error(error)
    process.exit(1)
}

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            version: '1.0.0',
            title: 'Express Application',
            description: 'Express Application API Documentation',
        },
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
    },
    apis: ['./models/*.js', './controllers/*.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middlewares
app.use(performanceMiddleware);
app.use(requestStatsMiddleware);

// Routers
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/instructors', instructorsRouter);
app.use('/tickets', ticketsRouter);
app.use('/booking', bookingRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
