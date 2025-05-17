import { model, Schema } from 'mongoose';

const ticketSchema = new Schema(
  {
    event_id: { type: Schema.Types.ObjectId, ref: 'events', required: true },
    booking_id: { type: Schema.Types.ObjectId, ref: 'bookings', required: true },
    ticket_code: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Ticket = model('tickets', ticketSchema);
