const express = require("express");
const {
  getAllEvents,
  getEvent,
  updateEvent,
  createEvent,
  deleteEvent,
   bookEventTickets,
   getAvailableTickets,
} = require("../controllers/events.controller");

const router = express.Router();

/* GET users listing. */
router.get("/", getAllEvents);
router.get("/:id", getEvent);
router.post("/", createEvent);
router.put("/", updateEvent);
router.delete("/:id", deleteEvent);
router.post("/book/:id",bookEventTickets);
router.get("/available/:id",getAvailableTickets);

module.exports = router;