const mongoose = require('mongoose');

const { Schema } = mongoose;

const eventSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        organizerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        totalTickets: {
            type: Number,
            required: true,
            min: 0,
        },
        availableTickets: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: ['active', 'cancelled', 'completed', 'postponed'],
            default: 'active',
        },
        tickets: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Ticket',
            },
        ],
    },
    {
        timestamps: true,
    },
);

// Віртуальне поле для перевірки чи подія вже пройшла
eventSchema.virtual('isPast').get(function () {
    return this.endDate < new Date();
});

// Віртуальне поле для перевірки чи подія скоро відбудеться
eventSchema.virtual('isUpcoming').get(function () {
    const now = new Date();
    return (
        this.startDate > now && this.startDate <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    );
});

// Метод для перевірки доступності події
eventSchema.methods.isAvailable = function () {
    return this.status === 'active' && this.availableTickets > 0 && !this.isPast;
};

// Метод для оновлення кількості доступних квитків
eventSchema.methods.updateAvailableTickets = function () {
    // Логіка оновлення доступних квитків на основі проданих/зарезервованих
    // буде реалізована в сервісі
};

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
