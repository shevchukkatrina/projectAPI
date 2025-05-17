import { model, Schema } from 'mongoose';

const eventSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    location: { type: String },
    event_date: { type: Date, required: true },
    total_tickets: { type: Number, required: true },
    available_tickets: { type: Number, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Event = model('events', eventSchema);
