const express = require("express");
const {
  getAllBooking,
  getBooking,
  updateBooking,
  createBooking,
  deleteBooking,
  getUserBookings,
  getEventBookings,
  cancelBooking,
  confirmBooking,
  getBookingStatus 
} = require("../controllers/booking.controller");

const router = express.Router();

/* GET users listing. */
router.get("/", getAllBooking);
router.get("/:id", getBooking);
router.put("/:id", updateBooking);
router.post("/", createBooking);
router.delete("/:id", deleteBooking);

router.get("/user/:id", getUserBookings);
router.get("/event/:id", getEventBookings);
router.put("/cancel/:id", cancelBooking);
router.put("/confirm/:id", confirmBooking);
router.get("/status/:id", getBookingStatus);

module.exports = router;
