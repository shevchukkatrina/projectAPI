const { Event, User } = require('../../models');

/**
 * Controller method to fetch all events with optional filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const findAllEvents = async (req, res) => {
    try {
        const { status, startDate, endDate, organizerId, searchQuery } = req.query;

        const filter = {};

        if (status) {
            filter.status = status;
        } else {
            filter.status = 'active';
        }

        if (organizerId) {
            filter.organizerId = organizerId;
        }

        if (startDate || endDate) {
            filter.startDate = {};

            if (startDate) {
                filter.startDate.$gte = new Date(startDate);
            }

            if (endDate) {
                filter.endDate = filter.endDate || {};
                filter.endDate.$lte = new Date(endDate);
            }
        }

        if (searchQuery) {
            filter.$or = [
                { title: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } },
            ];
        }

        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const sortBy = req.query.sortBy || 'startDate';
        const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
        const sort = { [sortBy]: sortOrder };

        const events = await Event.find(filter).sort(sort).skip(skip).limit(limit).lean();

        const totalEvents = await Event.countDocuments(filter);
        const totalPages = Math.ceil(totalEvents / limit);

        return res.status(200).json({
            success: true,
            data: events,
            pagination: {
                currentPage: page,
                totalPages,
                totalEvents,
                perPage: limit,
            },
        });
    } catch (error) {
        console.error('Error fetching events:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching events',
        });
    }
};

module.exports = findAllEvents;
