const bookingService = require('../services/bookingService');
const Booking = require('../models/Booking');

exports.createBooking = async (req, res, next) => {
  try {
    const { userId, roomId } = req.body;
    // req.user is populated by mockAuth middleware, use it if userId not explicitly provided
    const uid = userId || req.user.id;
    
    const result = await bookingService.createBooking(uid, roomId);
    if (result.waitlist) {
      return res.status(202).json({ success: true, waitlist: true, message: 'Room is full, added to waitlist', data: result });
    }
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const result = await bookingService.cancelBooking(req.params.id);
    
    // Attempt auto-promotion of next user on waitlist
    // Fire-and-forget background job
    bookingService.processWaitlist(result.booking.roomId).catch(console.error);

    res.json({ success: true, message: 'Booking cancelled successfully', data: result });
  } catch (err) {
    next(err);
  }
};

exports.getUserBooking = async (req, res, next) => {
  try {
    const uid = req.params.userId || req.user.id;
    const booking = await Booking.findOne({ userId: uid, status: 'Confirmed' }).populate('roomId');
    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.getAllBookings();
    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};
