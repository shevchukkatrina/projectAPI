const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  section: {
    type: String,
    required: true
  },
  row: {
    type: String
  },
  seat: {
    type: String
  },
  status: {
    type: String,
    enum: ['available', 'reserved', 'sold', 'cancelled'],
    default: 'available'
  },
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    default: null
  },
  reservationExpiry: {
    type: Date,
    default: null
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true  // Sparse індекс дозволяє null значення
  }
}, {
  timestamps: true
});

// Індекс для швидкого пошуку квитків за подією та статусом
ticketSchema.index({ eventId: 1, status: 1 });

// Метод для перевірки чи квиток доступний
ticketSchema.methods.isAvailable = function() {
  return this.status === 'available';
};

// Метод для резервування квитка
ticketSchema.methods.reserve = function(bookingId, expiryMinutes = 15) {
  if (this.isAvailable()) {
    this.status = 'reserved';
    this.bookingId = bookingId;
    
    // Встановлення часу закінчення резервації
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + expiryMinutes);
    this.reservationExpiry = expiryTime;
    
    return true;
  }
  return false;
};

// Метод для підтвердження продажу квитка
ticketSchema.methods.confirmSale = function() {
  if (this.status === 'reserved' && this.bookingId) {
    this.status = 'sold';
    this.reservationExpiry = null;
    return true;
  }
  return false;
};

// Метод для скасування резервації квитка
ticketSchema.methods.release = function() {
  if (this.status === 'reserved') {
    this.status = 'available';
    this.bookingId = null;
    this.reservationExpiry = null;
    return true;
  }
  return false;
};

// Генерація унікального штрих-коду при продажу квитка
ticketSchema.pre('save', function(next) {
  if (this.status === 'sold' && !this.barcode) {
    this.barcode = 'TKT' + Date.now() + Math.floor(Math.random() * 1000);
  }
  next();
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
