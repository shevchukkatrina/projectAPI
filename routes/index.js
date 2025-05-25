const express = require("express");
const router = express.Router();

const rootRouter = require("./root");
const usersRouter = require("./users");
const ticketsRouter = require("./tickets");
const bookingRouter = require("./booking");
const eventsRouter = require("./events");
const authRouter = require("./auth");

router.use("/", rootRouter);
router.use("/users", usersRouter);
router.use("/tickets", ticketsRouter);
router.use("/booking", bookingRouter);
router.use("/events", eventsRouter);
router.use("/auth", authRouter);

module.exports = router;
