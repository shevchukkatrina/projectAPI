const express = require('express');
const { getAllUsers, getUser, updateUser, createUser, deleteUser } = require('../controllers/users.controller');

const router = express.Router();

/* GET users listing. */
router.get('/', getAllUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.put('/', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
