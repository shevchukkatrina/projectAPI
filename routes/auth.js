/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Ім'я користувача або email
 *         password:
 *           type: string
 *           description: Пароль
 *       example:
 *         username: "user@example.com"
 *         password: "securePassword123"
 * 
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT токен для аутентифікації
 *       example:
 *         token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

 */

/**
 * @swagger
 * /login:
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
 *         description: Успішна авторизація
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Невірний логін або пароль
 */

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Вийти з системи
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Успішний вихід
 */

const express = require('express');
const { authController } = require('../controllers');

const router = express.Router();

router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;
