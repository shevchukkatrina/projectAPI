const express = require("express");
const { eventsController } = require("../controllers");

const router = express.Router();

router.get("/", eventsController.findAllEvents);
router.get("/:id", eventsController.findElementById);
router.post("/", eventsController.createEvent);
router.put("/:id", eventsController.updateEvent);
router.delete("/:id", eventsController.deleteEvent);

module.exports = router;
