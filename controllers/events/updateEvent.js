const mongoose = require('mongoose');
const { Event, User } = require('../../models');

/**
 * Controller method to update an existing event
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.user.id; // Assuming authentication middlewares sets this

        // Validate event ID format
        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid event ID format',
            });
        }

        // Find the event
        const event = await Event.findById(eventId);

        // Check if event exists
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }

        // Check if user has permission to update (must be organizer or admin)
        const user = await User.findById(userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access',
            });
        }

        // Check permission - user must be admin or the original organizer
        const isAdmin = user.role === 'admin';
        const isOrganizer = user.role === 'organizer' && event.organizerId.toString() === userId;

        if (!isAdmin && !isOrganizer) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to update this event',
            });
        }

        // Extract fields to update
        const {
            title,
            description,
            category,
            venue,
            startDate,
            endDate,
            status,
            imageUrl,
            totalTickets,
        } = req.body;

        // Validate dates if provided
        if (startDate && endDate) {
            const startDateObj = new Date(startDate);
            const endDateObj = new Date(endDate);

            if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
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

            if (isNaN(startDateObj.getTime())) {
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

            if (isNaN(endDateObj.getTime())) {
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

        // Check if status change is valid
        if (status && !['active', 'cancelled', 'completed', 'postponed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value',
            });
        }

        // Handle total tickets update (can only increase, not decrease)
        let { availableTickets } = event;

        if (totalTickets !== undefined) {
            const newTotalTickets = parseInt(totalTickets);

            if (isNaN(newTotalTickets) || newTotalTickets < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Total tickets must be a positive number',
                });
            }

            // Can only increase total tickets, not decrease below sold tickets
            const soldTickets = event.totalTickets - event.availableTickets;

            if (newTotalTickets < soldTickets) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot reduce total tickets below the number of sold tickets',
                });
            }

            // Adjust available tickets if total tickets increase
            if (newTotalTickets > event.totalTickets) {
                availableTickets += newTotalTickets - event.totalTickets;
            }
        }

        // Create update object with only provided fields
        const updateData = {};

        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (category !== undefined) updateData.category = category;
        if (venue !== undefined) updateData.venue = venue;
        if (startDate !== undefined) updateData.startDate = new Date(startDate);
        if (endDate !== undefined) updateData.endDate = new Date(endDate);
        if (status !== undefined) updateData.status = status;
        if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
        if (totalTickets !== undefined) {
            updateData.totalTickets = parseInt(totalTickets);
            updateData.availableTickets = availableTickets;
        }

        // Update the event
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

        // Handle validation errors
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
