const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Mock user ID (e.g., email or random ID)
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  status: { type: String, enum: ['Confirmed', 'Cancelled'], default: 'Confirmed' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
