const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Waitlist = require('../models/Waitlist');
const User = require('../models/User');
const roomService = require('../services/roomService');

exports.getStats = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    let totalCapacity = 0;
    let totalOccupied = 0;
    const typeStats = {};

    rooms.forEach(r => {
      totalCapacity += r.capacity;
      totalOccupied += r.occupants.length;

      if (!typeStats[r.type]) {
        typeStats[r.type] = { capacity: 0, occupied: 0, count: 0 };
      }
      typeStats[r.type].capacity += r.capacity;
      typeStats[r.type].occupied += r.occupants.length;
      typeStats[r.type].count += 1;
    });

    const totalBookings = await Booking.countDocuments({ status: 'Confirmed' });
    const waitlistCount = await Waitlist.countDocuments({ status: 'Waiting' });
    const occupancyPercentage = totalCapacity === 0 ? 0 : Math.round((totalOccupied / totalCapacity) * 100);

    const chartBar = Object.keys(typeStats).map(type => ({
      name: type,
      Capacity: typeStats[type].capacity,
      Occupancy: typeStats[type].occupied
    }));

    const chartPie = Object.keys(typeStats).map(type => ({
      name: type,
      value: typeStats[type].count
    }));

    res.json({
      success: true,
      data: {
        totalRooms: rooms.length,
        availableSlots: totalCapacity - totalOccupied,
        totalCapacity,
        totalOccupied,
        totalBookings,
        waitlistCount,
        occupancyPercentage,
        chartBar,
        chartPie
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.bulkCreateRooms = async (req, res, next) => {
  try {
    const newRooms = await roomService.bulkCreateRooms(req.body);
    res.json({ success: true, message: `Successfully generated ${newRooms.length} rooms.`, data: newRooms });
  } catch (err) {
    next(err);
  }
};

exports.seedDemo = async (req, res, next) => {
  try {
    await Booking.deleteMany({});
    await Waitlist.deleteMany({});
    await Room.deleteMany({});
    await User.deleteMany({});

    const types = [
      { t: 'Single', c: 1 }, 
      { t: 'Double', c: 2 }, 
      { t: 'Triple', c: 3 }
    ];
    let roomCounter = 1;
    let roomDocs = [];
    
    for (const t of types) {
      for(let i=0; i<5; i++) {
        roomDocs.push({
          roomNumber: `DEMO-${100 + roomCounter}`,
          type: t.t,
          capacity: t.c,
          status: 'Available',
          occupants: []
        });
        roomCounter++;
      }
    }
    const savedRooms = await Room.insertMany(roomDocs);

    // Create 3 mock bookings
    const mockBookings = [
      { userId: 'pitch_user_1', roomId: savedRooms[0]._id, status: 'Confirmed' },
      { userId: 'pitch_user_2', roomId: savedRooms[1]._id, status: 'Confirmed' },
      { userId: 'pitch_user_3', roomId: savedRooms[5]._id, status: 'Confirmed' }
    ];
    await Booking.insertMany(mockBookings);

    // Sync room occupancy (since we are in mock mode, manually syncing is easier)
    savedRooms[0].occupants.push('pitch_user_1');
    savedRooms[0].status = 'Full';
    await savedRooms[0].save();

    savedRooms[1].occupants.push('pitch_user_2');
    savedRooms[1].status = 'Full';
    await savedRooms[1].save();

    savedRooms[5].occupants.push('pitch_user_3');
    savedRooms[5].status = 'Partially Filled'; 
    await savedRooms[5].save();

    res.json({ success: true, message: 'Pitch Mode Data Successfully Seeded with Active Metrics!', data: savedRooms });
  } catch (err) {
    next(err);
  }
};

exports.resetSystem = async (req, res, next) => {
  try {
    await Booking.deleteMany({});
    await Waitlist.deleteMany({});
    await Room.updateMany({}, { $set: { occupants: [], status: 'Available' } });
    await User.updateMany({}, { $set: { bookingId: null, waitlistId: null } });

    res.json({ success: true, message: 'System data has been successfully reset.' });
  } catch (err) {
    next(err);
  }
};
