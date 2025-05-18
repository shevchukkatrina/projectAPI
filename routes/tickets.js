const express = require('express');
const { getAllTickets, getTicket, updateTicket, createTicket, deleteTicket } = require('../controllers/tickets.contoller');

const router = express.Router();

/* GET users listing. */
router.get('/', getAllTickets);
router.get('/:id', getTicket);
router.post('/', createTicket);
router.put('/', updateTicket);
router.delete('/:id', deleteTicket);

module.exports = router;
