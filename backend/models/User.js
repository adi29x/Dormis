const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // "demo_user_1"
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null },
  waitlistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Waitlist', default: null }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
