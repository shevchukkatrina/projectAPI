const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ticketId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Ticket",
        required: true,
      },
    ],
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "expired", "completed"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentDetails: {
      method: String,
      transactionId: String,
      paidAt: Date,
      amount: Number,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    bookingReference: {
      type: String,
      unique: true,
    },
    contactInfo: {
      email: String,
      phone: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Індекс для швидкого пошуку бронювань користувача
bookingSchema.index({ userId: 1, status: 1 });
bookingSchema.index({ bookingReference: 1 });

// Віртуальне поле для перевірки чи бронювання прострочене
bookingSchema.virtual("isExpired").get(function () {
  return this.expiryDate && this.expiryDate < new Date();
});

// Генерація унікального номеру бронювання
bookingSchema.pre("save", function (next) {
  if (!this.bookingReference) {
    // Формат: BOOK-YYYY-MM-DD-RANDOM
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");

    this.bookingReference = `BOOK-${year}${month}${day}-${random}`;
  }

  // Встановлення дати закінчення бронювання (15 хвилин від створення)
  if (!this.expiryDate && this.isNew) {
    this.expiryDate = new Date(Date.now() + 15 * 60 * 1000);
  }

  next();
});

// Метод для підтвердження бронювання
bookingSchema.methods.confirm = function () {
  if (this.status === "pending") {
    this.status = "confirmed";
    this.paymentStatus = "paid";
    if (!this.paymentDetails) {
      this.paymentDetails = {};
    }
    this.paymentDetails.paidAt = new Date();
    return true;
  }
  return false;
};

// Метод для скасування бронювання
bookingSchema.methods.cancel = function () {
  if (["pending", "confirmed"].includes(this.status)) {
    this.status = "cancelled";
    return true;
  }
  return false;
};

// Метод для маркування бронювання як завершеного
bookingSchema.methods.complete = function () {
  if (this.status === "confirmed") {
    this.status = "completed";
    return true;
  }
  return false;
};

// Метод для перевірки чи можна скасувати бронювання
bookingSchema.methods.canBeCancelled = function () {
  return ["pending", "confirmed"].includes(this.status) && !this.isExpired;
};

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
