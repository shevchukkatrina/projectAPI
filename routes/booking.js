/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentDetails:
 *       type: object
 *       properties:
 *         method:
 *           type: string
 *         transactionId:
 *           type: string
 *         paidAt:
 *           type: string
 *           format: date-time
 *         amount:
 *           type: number
 *           minimum: 0
 *
 *     ContactInfo:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *
 *     Booking:
 *       type: object
 *       required:
 *         - userId
 *         - ticketId
 *         - eventId
 *         - expiryDate
 *         - totalPrice
 *       properties:
 *         userId:
 *           type: string
 *           description: ID користувача
 *         ticketId:
 *           type: array
 *           items:
 *             type: string
 *           description: Масив ID квитків
 *         eventId:
 *           type: string
 *         bookingDate:
 *           type: string
 *           format: date-time
 *         expiryDate:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [pending, confirmed, cancelled, expired, completed]
 *         paymentStatus:
 *           type: string
 *           enum: [pending, paid, failed, refunded]
 *         paymentDetails:
 *           $ref: '#/components/schemas/PaymentDetails'
 *         totalPrice:
 *           type: number
 *         bookingReference:
 *           type: string
 *         contactInfo:
 *           $ref: '#/components/schemas/ContactInfo'
 *       example:
 *         userId: "60c72b2f5f1b2c001c8d4567"
 *         ticketId: ["60c72b2f5f1b2c001c8d1234"]
 *         eventId: "60c72b2f5f1b2c001c8d9999"
 *         expiryDate: "2025-05-30T10:30:00Z"
 *         totalPrice: 300
 *         contactInfo:
 *           email: "user@example.com"
 *           phone: "+380991234567"
 */

/**
 * @swagger
 * /booking:
 *   get:
 *     summary: Отримати всі бронювання
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: Список бронювань
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *
 *   post:
 *     summary: Створити нове бронювання
 *     tags: [Booking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       201:
 *         description: Бронювання створене
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 */

/**
 * @swagger
 * /booking/{id}:
 *   get:
 *     summary: Отримати бронювання по ID
 *     tags: [Booking]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID бронювання
 *     responses:
 *       200:
 *         description: Знайдене бронювання
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       404:
 *         description: Бронювання не знайдено
 *
 *   put:
 *     summary: Оновити бронювання по ID
 *     tags: [Booking]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID бронювання
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       200:
 *         description: Оновлено
 *
 *   delete:
 *     summary: Видалити бронювання
 *     tags: [Booking]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID бронювання
 *     responses:
 *       204:
 *         description: Успішно видалено
 */

/**
 * @swagger
 * /booking/user/{id}:
 *   get:
 *     summary: Отримати бронювання користувача
 *     tags: [Booking]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID користувача
 *     responses:
 *       200:
 *         description: Список бронювань користувача
 */

/**
 * @swagger
 * /booking/event/{id}:
 *   get:
 *     summary: Отримати бронювання для події
 *     tags: [Booking]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID події
 *     responses:
 *       200:
 *         description: Список бронювань для події
 */

/**
 * @swagger
 * /booking/cancel/{id}:
 *   put:
 *     summary: Скасувати бронювання
 *     tags: [Booking]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID бронювання
 *     responses:
 *       200:
 *         description: Бронювання скасовано
 *       400:
 *         description: Неможливо скасувати
 */

/**
 * @swagger
 * /booking/confirm/{id}:
 *   put:
 *     summary: Підтвердити бронювання
 *     tags: [Booking]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID бронювання
 *     responses:
 *       200:
 *         description: Бронювання підтверджено
 *       400:
 *         description: Неможливо підтвердити
 */

/**
 * @swagger
 * /booking/status/{id}:
 *   get:
 *     summary: Отримати статус бронювання
 *     tags: [Booking]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID бронювання
 *     responses:
 *       200:
 *         description: Статус повернуто
 */

const express = require('express');
const { bookingsController } = require('../controllers');

const router = express.Router();

/* GET users listing. */
router.get('/', bookingsController.getAllBookings);
router.get('/:id', bookingsController.getBooking);
router.put('/:id', bookingsController.updateBooking);
router.post('/', bookingsController.createBooking);
router.delete('/:id', bookingsController.deleteBooking);

router.get('/user/:id', bookingsController.getUserBookings);
router.get('/event/:id', bookingsController.getEventBookings);
router.put('/cancel/:id', bookingsController.cancelBooking);
router.put('/confirm/:id', bookingsController.confirmBooking);
router.get('/status/:id', bookingsController.getBookingStatus);

module.exports = router;
