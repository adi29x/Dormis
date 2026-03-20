const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  type: { type: String, enum: ['Single', 'Double', 'Triple'], required: true },
  capacity: { type: Number, required: true },
  status: { type: String, enum: ['Available', 'Partially Filled', 'Full'], default: 'Available' },
  occupants: [{ type: String }] // Stores userId (e.g., "demo_user_1") or can be expanded to ref User if using ObjectIds
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
