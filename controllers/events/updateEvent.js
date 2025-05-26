const mongoose = require('mongoose');
const { Event, User } = require('../../models');

/**
 * Controller method to update an existing event
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateEvent = async (req, res) => {
    try {
        const { id: eventId } = req.params;
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid event ID format',
            });
        }

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access',
            });
        }

        const isAdmin = user.role === 'admin';
        const isOrganizer = user.role === 'organizer' && event.organizerId.toString() === userId;

        if (!isAdmin && !isOrganizer) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to update this event',
            });
        }

        const {
            title,
            description,
            startDate,
            endDate,
            status,
            totalTickets,
        } = req.body;

        if (startDate && endDate) {
            const startDateObj = new Date(startDate);
            const endDateObj = new Date(endDate);

            if (Number.isNaN(startDateObj.getTime()) || Number.isNaN(endDateObj.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid date format',
                });
            }

            if (endDateObj <= startDateObj) {
                return res.status(400).json({
                    success: false,
                    message: 'End date must be after start date',
                });
            }
        } else if (startDate) {
            const startDateObj = new Date(startDate);
            const endDateObj = event.endDate;

            if (Number.isNaN(startDateObj.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid start date format',
                });
            }

            if (endDateObj <= startDateObj) {
                return res.status(400).json({
                    success: false,
                    message: 'End date must be after start date',
                });
            }
        } else if (endDate) {
            const startDateObj = event.startDate;
            const endDateObj = new Date(endDate);

            if (Number.isNaN(endDateObj.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid end date format',
                });
            }

            if (endDateObj <= startDateObj) {
                return res.status(400).json({
                    success: false,
                    message: 'End date must be after start date',
                });
            }
        }

        if (status && !['active', 'cancelled', 'completed', 'postponed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value',
            });
        }

        let { availableTickets } = event;

        if (totalTickets !== undefined) {
            const newTotalTickets = parseInt(totalTickets, 10);

            if (Number.isNaN(newTotalTickets) || newTotalTickets < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Total tickets must be a positive number',
                });
            }

            const soldTickets = event.totalTickets - event.availableTickets;

            if (newTotalTickets < soldTickets) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot reduce total tickets below the number of sold tickets',
                });
            }

            if (newTotalTickets > event.totalTickets) {
                availableTickets += newTotalTickets - event.totalTickets;
            }
        }

        const updateData = {};

        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (startDate !== undefined) updateData.startDate = new Date(startDate);
        if (endDate !== undefined) updateData.endDate = new Date(endDate);
        if (status !== undefined) updateData.status = status;
        if (totalTickets !== undefined) {
            updateData.totalTickets = parseInt(totalTickets, 10);
            updateData.availableTickets = availableTickets;
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            { $set: updateData },
            { new: true, runValidators: true },
        );

        return res.status(200).json({
            success: true,
            message: 'Event updated successfully',
            data: updatedEvent,
        });
    } catch (error) {
        console.error('Error updating event:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', '),
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Server error while updating event',
        });
    }
};

module.exports = updateEvent;
