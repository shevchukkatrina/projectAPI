const express = require('express');
const { usersController } = require('../controllers');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.get('/', authenticate, usersController.getAllUsers);
router.get('/:id', usersController.getUser);
router.post('/', authenticate, usersController.createUser);
router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);

module.exports = router;
