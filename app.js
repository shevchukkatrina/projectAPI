const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const performanceMiddleware = require("./middleware/performance");
const requestStatsMiddleware = require("./middleware/requestStats");
require("dotenv").config();

const rootRouter = require("./routes");

const initMongoDB = require("./db/initMongoDB");
const notFoundMiddleware = require("./middleware/notFound");
const errorHandlerMiddleware = require("./middleware/errorHandler");

try {
  initMongoDB();
} catch (error) {
  console.log("Error while init Mongo database");
  console.error(error);
  process.exit(1);
}
const setupSwagger = require("./swagger");

const app = express();
setupSwagger(app);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(require('./swagger')));

// const swaggerOptions = {
//     swaggerDefinition: {
//         info: {
//             version: '1.0.0',
//             title: 'Express Application',
//             description: 'Express Application API Documentation',
//         },
//         schemes: ['http'],
//         consumes: ['application/json'],
//         produces: ['application/json'],
//     },
//     apis: ['./models/*.js', './controllers/*.js'],
// };

// const swaggerSpec = swaggerJSDoc(swaggerOptions);

// app.get('/api-docs.json', (req, res) => {
//     res.setHeader('Content-Type', 'application/json');
//     res.send(swaggerSpec);
// });

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middlewares
app.use(performanceMiddleware);
app.use(requestStatsMiddleware);

// Router
app.use("/", rootRouter);

// catch 404 and forward to error handler
app.use(notFoundMiddleware);

// error handler
app.use(errorHandlerMiddleware);

module.exports = app;
