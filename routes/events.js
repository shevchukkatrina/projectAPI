/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - startDate
 *         - endDate
 *         - organizerId
 *         - totalTickets
 *         - availableTickets
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         organizerId:
 *           type: string
 *           description: ID організатора (User)
 *         totalTickets:
 *           type: integer
 *           minimum: 0
 *         availableTickets:
 *           type: integer
 *           minimum: 0
 *         status:
 *           type: string
 *           enum: [active, cancelled, completed, postponed]
 *         tickets:
 *           type: array
 *           items:
 *             type: string
 *             description: ID квитка (Ticket)
 *       example:
 *         title: "Концерт гурту Бумбокс"
 *         description: "Живий виступ гурту в Києві"
 *         startDate: "2025-06-10T18:00:00Z"
 *         endDate: "2025-06-10T21:00:00Z"
 *         organizerId: "60c72b2f5f1b2c001c8d0001"
 *         totalTickets: 500
 *         availableTickets: 120
 *         status: "active"
 *         tickets: ["60d72b2f5f1b2c001c8d1111"]
 */

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: API для керування подіями
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Отримати список всіх подій
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Список подій
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *
 *   post:
 *     summary: Створити нову подію
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: Подію створено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 */

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Отримати подію за ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID події
 *     responses:
 *       200:
 *         description: Подію знайдено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Подію не знайдено
 *
 *   put:
 *     summary: Оновити подію
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID події
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Подію оновлено
 *
 *   delete:
 *     summary: Видалити подію
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID події
 *     responses:
 *       204:
 *         description: Успішно видалено
 *       404:
 *         description: Подію не знайдено
 */

const express = require("express");
const { eventsController } = require("../controllers");

const router = express.Router();

router.get("/", eventsController.findAllEvents);
router.get("/:id", eventsController.findElementById);
router.post("/", eventsController.createEvent);
router.put("/:id", eventsController.updateEvent);
router.delete("/:id", eventsController.deleteEvent);

module.exports = router;
