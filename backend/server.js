require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const errorHandler = require('./middleware/errorHandler');
const mockAuth = require('./middleware/mockAuth');

const roomRoutes = require('./routes/rooms');
const bookingRoutes = require('./routes/bookings');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(mockAuth);

// Routes
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

const { MongoMemoryServer } = require('mongodb-memory-server');
const Room = require('./models/Room');

const initializeDB = async () => {
  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  console.log('MongoDB Memory Server Connected');

  const count = await Room.countDocuments();
  if (count === 0) {
    const rooms = [
      { roomNumber: 'A-101', type: 'Single', capacity: 1, status: 'Available' },
      { roomNumber: 'A-102', type: 'Single', capacity: 1, status: 'Available' },
      { roomNumber: 'B-201', type: 'Double', capacity: 2, status: 'Available' },
      { roomNumber: 'B-202', type: 'Double', capacity: 2, status: 'Available' },
      { roomNumber: 'C-301', type: 'Triple', capacity: 3, status: 'Available' },
      { roomNumber: 'C-302', type: 'Triple', capacity: 3, status: 'Available' }
    ];
    await Room.insertMany(rooms);
    console.log('Dummy rooms seeded in memory!');
  }
};
initializeDB().catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
