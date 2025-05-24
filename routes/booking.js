const express = require("express");
const { bookingsController } = require("../controllers");

const router = express.Router();

/* GET users listing. */
router.get("/", bookingsController.getAllBookings);
router.get("/:id", bookingsController.getBooking);
router.put("/:id", bookingsController.updateBooking);
router.post("/", bookingsController.createBooking);
router.delete("/:id", bookingsController.deleteBooking);

router.get("/user/:id", bookingsController.getUserBookings);
router.get("/event/:id", bookingsController.getEventBookings);
router.put("/cancel/:id", bookingsController.cancelBooking);
router.put("/confirm/:id", bookingsController.confirmBooking);
router.get("/status/:id", bookingsController.getBookingStatus);

module.exports = router;
