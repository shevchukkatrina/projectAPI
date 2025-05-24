const { ticketsController } = require("../controllers");
const express = require("express");

const router = express.Router();

router.get("/", ticketsController.getAllTickets);
router.get("/:id", ticketsController.getTicket);
router.post("/", ticketsController.createTicket);
router.put("/", ticketsController.updateTicket);
router.delete("/:id", ticketsController.deleteTicket);

module.exports = router;
