const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Project API",
      version: "1.0.0",
      description: "API для системи бронювання квитків",
    },
    servers: [{ url: "http://localhost:3000" }],
  },
  apis: ["./routes/*.js", "./models/*.js"], // важливо, має бути вірний шлях
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
};

module.exports = setupSwagger;
