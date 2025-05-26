/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Аутентифікація користувачів
 *   - name: Users
 *     description: Операції над користувачами
 *   - name: Tickets
 *     description: Квитки на події
 *   - name: Booking
 *     description: Бронювання квитків
 *   - name: Events
 *     description: Управління подіями
 *   - name: Root
 *     description: Базовий маршрут (для тесту доступності API)
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Перевірка доступності API
 *     tags: [Root]
 *     responses:
 *       200:
 *         description: API працює
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: API is running
 */

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
