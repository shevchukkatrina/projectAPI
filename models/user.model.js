const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        phoneNumber: {
            type: String,
            trim: true,
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'organizer'],
            default: 'user',
        },
        bookings: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Booking',
            },
        ],
    },
    {
        timestamps: true,
    },
);

// Метод для перевірки чи є користувач адміністратором
userSchema.methods.isAdmin = function () {
    return this.role === 'admin';
};

// Метод для перевірки чи є користувач організатором подій
userSchema.methods.isOrganizer = function () {
    return this.role === 'organizer';
};

const User = mongoose.model('User', userSchema);

module.exports = User;
