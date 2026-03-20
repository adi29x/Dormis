require('dotenv').config();
const mongoose = require('mongoose');
const Room = require('./models/Room');
const Booking = require('./models/Booking');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hostel-booking');

const seedRooms = async () => {
  try {
    await Room.deleteMany();
    await Booking.deleteMany();

    const rooms = [
      { roomNumber: 'A-101', type: 'Single', capacity: 1, status: 'Available' },
      { roomNumber: 'A-102', type: 'Single', capacity: 1, status: 'Available' },
      { roomNumber: 'B-201', type: 'Double', capacity: 2, status: 'Available' },
      { roomNumber: 'B-202', type: 'Double', capacity: 2, status: 'Available' },
      { roomNumber: 'C-301', type: 'Triple', capacity: 3, status: 'Available' },
      { roomNumber: 'C-302', type: 'Triple', capacity: 3, status: 'Available' }
    ];

    await Room.insertMany(rooms);
    console.log('Dummy rooms seeded successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedRooms();
