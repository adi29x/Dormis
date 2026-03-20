const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // "demo_user_1"
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  status: { type: String, enum: ['Waiting', 'Promoted', 'Cancelled'], default: 'Waiting' }
}, { timestamps: true });

module.exports = mongoose.model('Waitlist', waitlistSchema);
