const express = require("express");
const {
  getAllEvents,
  getEvent,
  updateEvent,
  createEvent,
  deleteEvent,
   getAvailableTickets,
} = require("../controllers/events.controller");

const router = express.Router();

/* GET users listing. */
router.get("/", getAllEvents);
router.get("/:id", getEvent);
router.post("/", createEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);
router.get("/available/:id",getAvailableTickets);

module.exports = router;