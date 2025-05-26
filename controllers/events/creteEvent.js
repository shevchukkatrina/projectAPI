/* eslint-disable no-underscore-dangle */
const { Event, User } = require('../../models');

/**
 * Controller method to create a new event
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createEvent = async (req, res) => {
    try {
        const { title, description, startDate, endDate, totalTickets } = req.body;

        if (
            [title, description, startDate, endDate, totalTickets].some(
                value => value === undefined,
            )
        ) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields',
            });
        }

        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
        const currentDate = new Date();

        if (Number.isNaN(startDateObj.getTime()) || Number.isNaN(endDateObj.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format',
            });
        }

        if (startDateObj < currentDate) {
            return res.status(400).json({
                success: false,
                message: 'Start date cannot be in the past',
            });
        }

        if (endDateObj <= startDateObj) {
            return res.status(400).json({
                success: false,
                message: 'End date must be after start date',
            });
        }

        const organizerId = req.user._id;

        const organizer = await User.findById(organizerId);
        if (!organizer) {
            return res.status(404).json({
                success: false,
                message: 'Organizer not found',
            });
        }

        const newEvent = new Event({
            title,
            description,
            startDate: startDateObj,
            endDate: endDateObj,
            organizerId,
            totalTickets: parseInt(totalTickets, 10),
            availableTickets: parseInt(totalTickets, 10), // Initially all tickets are available
            status: 'active',
        });

        await newEvent.save();

        return res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: {
                eventId: newEvent._id,
                title: newEvent.title,
                startDate: newEvent.startDate,
                totalTickets: newEvent.totalTickets,
            },
        });
    } catch (error) {
        console.error('Error creating event:', error);

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'An event with similar details already exists',
            });
        }

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', '),
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Server error while creating event',
        });
    }
};

module.exports = createEvent;
