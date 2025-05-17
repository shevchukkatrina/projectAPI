import { model, Schema } from 'mongoose';

const bookingSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'users', default: null },
    event_id: { type: Schema.Types.ObjectId, ref: 'events', required: true },
    quantity: { type: Number, required: true },
    booking_time: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Booking = model('bookings', bookingSchema);
