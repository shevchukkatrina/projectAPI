const bookingService = require('../../service/bookings');

const deleteBooking = async (req, res) => {
    const { id } = req.params;
    const result = await bookingService.deleteBooking(id);
    res.status(204).send();
};

module.exports = deleteBooking;
