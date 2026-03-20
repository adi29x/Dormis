const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Waitlist = require('../models/Waitlist');
const Room = require('../models/Room');
const User = require('../models/User');
const config = require('../config/config');

class BookingService {
  async getAllBookings() {
    return await Booking.find().populate('roomId');
  }

  async getBookingsByUser(userId) {
    return await Booking.find({ userId }).populate('roomId');
  }

  async createBooking(userId, roomId) {
    if (!config.bookingEnabled) {
      throw new Error("Booking window is currently closed.");
    }

    // 1. Validate if user already holds a booking
    // Real OAuth users might not map to the mock User doc cleanly until initialized
    // So we check by checking the Bookings collection
    const existing = await Booking.findOne({ userId, status: 'Confirmed' });
    if (existing) {
      throw new Error("User already holds an active booking.");
    }

    // 2. Atomic FindAndUpdate ensuring bounded capacity!
    // We check if $size of occupants < capacity
    const updatedRoom = await Room.findOneAndUpdate(
      { 
        _id: roomId, 
        $expr: { $lt: [{ $size: "$occupants" }, "$capacity"] } 
      },
      { 
        $push: { occupants: userId }
      },
      { new: true } // Returns the modified document
    );

    if (!updatedRoom) {
      // Room is either Full, Not Found, or race-condition blocked us!
      // Revert to waitlist
      const roomCheck = await Room.findById(roomId);
      if(!roomCheck) throw new Error("Room does not exist.");

      // Capacity hit, user goes to waitlist
      const waitlistRecord = new Waitlist({ userId, roomId });
      await waitlistRecord.save();
      return { success: true, waitlist: waitlistRecord, room: roomCheck };
    }

    // Since we successfully incremented capacity, we finalize Status mathematically
    let newStatus = 'Available';
    if (updatedRoom.occupants.length >= updatedRoom.capacity) newStatus = 'Full';
    else if (updatedRoom.occupants.length > 0) newStatus = 'Partially Filled';
    
    updatedRoom.status = newStatus;
    await updatedRoom.save(); // Just saving the status string separately from the atomic push

    // Finalize the ledger
    const booking = new Booking({
      userId,
      roomId,
      status: 'Confirmed'
    });
    await booking.save();

    // In a prod env we would also update the User doc: User.findByIdAndUpdate(userId, { bookingId: booking._id })
    // But since users are mocked for now, booking collection is truth.

    return { success: true, booking, room: updatedRoom };
  }

  async cancelBooking(bookingId) {
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      throw new Error("Invalid booking ID format.");
    }
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new Error("Booking not found.");
    if (booking.status === 'Cancelled') throw new Error("Booking already cancelled.");

    // 1. Remove from Room Occupants array
    const room = await Room.findById(booking.roomId);
    if (room) {
      room.occupants = room.occupants.filter(uid => String(uid) !== String(booking.userId));
      
      let newStatus = 'Available';
      if (room.occupants.length >= room.capacity) newStatus = 'Full';
      else if (room.occupants.length > 0) newStatus = 'Partially Filled';
      room.status = newStatus;
      
      await room.save();
    }

    // 2. Mark Booking Cancelled
    booking.status = 'Cancelled';
    await booking.save();

    return { success: true, booking };
  }

  async processWaitlist(roomId) {
    // If a room just became available, pop the first person on waitlist and create booking
    const room = await Room.findById(roomId);
    if (!room || room.occupants.length >= room.capacity) return false;

    const nextInLine = await Waitlist.findOne({ roomId, status: 'Waiting' }).sort({ createdAt: 1 });
    if (!nextInLine) return false;

    try {
      await this.createBooking(nextInLine.userId, roomId);
      nextInLine.status = 'Promoted';
      await nextInLine.save();
      return true;
    } catch(err) {
      console.error("Waitlist auto-promotion failed", err);
      return false;
    }
  }
}

module.exports = new BookingService();
