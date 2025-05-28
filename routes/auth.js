/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: Електронна пошта користувача
 *         password:
 *           type: string
 *           description: Пароль користувача
 *       example:
 *         email: "test@gmail.com"
 *         password: "123123"
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT токен для аутентифікації
 *       example:
 *         token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Увійти в систему
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Успішна авторизація, повертає JWT токен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Невірний логін або пароль
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Вийти з системи
 *     tags: [Auth]
 * security:
 *    - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успішний вихід
 *       401:
 *         description: Неавторизований запит (відсутній або некоректний токен)
 */

const express = require('express');
const { authController } = require('../controllers');

const router = express.Router();

router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;
