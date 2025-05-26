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

        // Validate event ID format
        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid event ID format',
            });
        }

        // Find the event
        const event = await Event.findById(eventId).session(session);

        // Check if event exists
        if (!event) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }

        // Check if user has permission to delete (must be organizer or admin)
        const user = await User.findById(userId).session(session);

        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access',
            });
        }

        // Check permission - user must be admin or the original organizer
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

        // Check if the event has active bookings
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

        // Handle soft delete vs. hard delete
        const hardDelete = req.query.hardDelete === 'true' && isAdmin;

        if (hardDelete) {
            // Only admins can perform hard deletes

            // First, cancel all related bookings
            await Booking.updateMany({ eventId }, { $set: { status: 'cancelled' } }).session(
                session,
            );

            // Delete all tickets related to this event
            await Ticket.deleteMany({ eventId }).session(session);

            // Delete the event itself
            await Event.findByIdAndDelete(eventId).session(session);

            await session.commitTransaction();
            session.endSession();

            return res.status(200).json({
                success: true,
                message: 'Event and all related data have been permanently deleted',
            });
        }
        // Soft delete - just change status to cancelled and hide from listings
        event.status = 'cancelled';
        await event.save({ session });

        // Cancel all pending bookings
        await Booking.updateMany(
            { eventId, status: 'pending' },
            { $set: { status: 'cancelled' } },
        ).session(session);

        // Mark all available tickets as cancelled
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
        // Abort transaction on error
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
