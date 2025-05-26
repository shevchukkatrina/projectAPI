/**
 * @swagger
 * components:
 *   schemas:
 *     Ticket:
 *       type: object
 *       required:
 *         - eventId
 *         - price
 *         - section
 *       properties:
 *         eventId:
 *           type: string
 *           description: ID події
 *         price:
 *           type: number
 *           minimum: 0
 *           description: Ціна квитка
 *         section:
 *           type: string
 *           description: Сектор
 *         row:
 *           type: string
 *           description: Ряд (необов’язково)
 *         seat:
 *           type: string
 *           description: Місце (необов’язково)
 *         status:
 *           type: string
 *           enum: [available, reserved, sold, cancelled]
 *           default: available
 *           description: Статус квитка
 *         bookingId:
 *           type: string
 *           nullable: true
 *           description: ID бронювання
 *         reservationExpiry:
 *           type: string
 *           format: date-time
 *           description: Час завершення резервування
 *         barcode:
 *           type: string
 *           description: Унікальний штрих-код квитка
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         eventId: "60d21b4667d0d8992e610c85"
 *         price: 500
 *         section: "A"
 *         row: "12"
 *         seat: "18"
 *         status: "available"
 *         bookingId: null
 *         reservationExpiry: null
 *         barcode: "TKT1685299200000123"
 *         createdAt: "2025-05-26T10:00:00.000Z"
 *         updatedAt: "2025-05-26T10:00:00.000Z"
 */

/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Отримати список усіх квитків
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: Успішне отримання списку
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 */

/**
 * @swagger
 * /tickets/{id}:
 *   get:
 *     summary: Отримати квиток за ID
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID квитка
 *     responses:
 *       200:
 *         description: Знайдено квиток
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       404:
 *         description: Квиток не знайдено
 */

/**
 * @swagger
 * /tickets:
 *   post:
 *     summary: Створити новий квиток
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ticket'
 *     responses:
 *       201:
 *         description: Квиток створено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 */

/**
 * @swagger
 * /tickets:
 *   put:
 *     summary: Оновити існуючий квиток
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ticket'
 *     responses:
 *       200:
 *         description: Квиток оновлено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       404:
 *         description: Квиток не знайдено
 */

/**
 * @swagger
 * /tickets/{id}:
 *   delete:
 *     summary: Видалити квиток за ID
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID квитка
 *     responses:
 *       204:
 *         description: Квиток видалено
 *       404:
 *         description: Квиток не знайдено
 */

const { ticketsController } = require("../controllers");
const express = require("express");

const router = express.Router();

router.get("/", ticketsController.getAllTickets);
router.get("/:id", ticketsController.getTicket);
router.post("/", ticketsController.createTicket);
router.put("/", ticketsController.updateTicket);
router.delete("/:id", ticketsController.deleteTicket);

module.exports = router;
