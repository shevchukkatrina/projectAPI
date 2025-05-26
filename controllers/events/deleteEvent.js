const mongoose = require('mongoose');
const { Event, Ticket, Booking, User } = require('../../models');

/**
 * Controller method to delete an event
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteEvent = async (req, res) => {
    // Start a MongoDB session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id: eventId } = req.params;
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid event ID format',
            });
        }

        const event = await Event.findById(eventId).session(session);

        if (!event) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }

        const user = await User.findById(userId).session(session);

        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access',
            });
        }

        const isAdmin = user.role === 'admin';
        const isOrganizer = user.role === 'organizer' && event.organizerId.toString() === userId;

        if (!isAdmin && !isOrganizer) {
            await session.abortTransaction();
            session.endSession();
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to delete this event',
            });
        }

        const activeBookings = await Booking.countDocuments({
            eventId,
            status: { $in: ['confirmed', 'pending'] },
        }).session(session);

        if (activeBookings > 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                success: false,
                message: 'Cannot delete event with active bookings',
                activeBookings,
            });
        }

        const hardDelete = req.query.hardDelete === 'true' && isAdmin;

        if (hardDelete) {
            await Booking.updateMany({ eventId }, { $set: { status: 'cancelled' } }).session(
                session,
            );

            await Ticket.deleteMany({ eventId }).session(session);

            await Event.findByIdAndDelete(eventId).session(session);

            await session.commitTransaction();
            session.endSession();

            return res.status(200).json({
                success: true,
                message: 'Event and all related data have been permanently deleted',
            });
        }
        event.status = 'cancelled';
        await event.save({ session });

        await Booking.updateMany(
            { eventId, status: 'pending' },
            { $set: { status: 'cancelled' } },
        ).session(session);

        await Ticket.updateMany(
            { eventId, status: 'available' },
            { $set: { status: 'cancelled' } },
        ).session(session);

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success: true,
            message: 'Event has been cancelled successfully',
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error('Error deleting event:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while deleting event',
        });
    }
};

module.exports = deleteEvent;
