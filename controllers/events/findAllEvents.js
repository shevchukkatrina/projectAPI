const { Event } = require('../../models');

/**
 * Controller method to fetch all events with optional filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const findAllEvents = async (req, res) => {
    try {
        // Extract query parameters for filtering
        const { category, status, startDate, endDate, venue, organizerId, searchQuery } = req.query;

        // Create filter object
        const filter = {};

        // Apply filters if provided
        if (category) {
            filter.category = category;
        }

        if (status) {
            filter.status = status;
        } else {
            // By default show only active events
            filter.status = 'active';
        }

        if (venue) {
            filter.venue = { $regex: venue, $options: 'i' }; // Case-insensitive search
        }

        if (organizerId) {
            filter.organizerId = organizerId;
        }

        // Date range filtering
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

        // Text search across multiple fields if search query provided
        if (searchQuery) {
            filter.$or = [
                { title: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } },
            ];
        }

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Sorting
        const sortBy = req.query.sortBy || 'startDate';
        const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
        const sort = { [sortBy]: sortOrder };

        // Execute query with pagination
        const events = await Event.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate('organizerId', 'firstName lastName email')
            .lean();

        // Get total count for pagination metadata
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
