const express = require('express');
const { usersController } = require('../controllers');
const { authenticate } = require('../middlewares');

const router = express.Router();

router.use(authenticate);

router.get('/', usersController.getAllUsers);
router.get('/:id', usersController.getUser);
router.post('/', usersController.createUser);
router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);

module.exports = router;
