const roomService = require('../services/roomService');

exports.getAllRooms = async (req, res, next) => {
  try {
    const { type, availability } = req.query;
    let filter = {};
    if (type && type !== 'All') filter.type = type;
    if (availability && availability !== 'All') {
      if (availability === 'Available') filter.status = 'Available';
      else filter.status = { $ne: 'Full' }; 
    }
    
    const rooms = await roomService.getAllRooms(filter);
    res.json({ success: true, data: rooms });
  } catch (err) {
    next(err);
  }
};

exports.getRoomById = async (req, res, next) => {
  try {
    const room = await roomService.getRoomById(req.params.id);
    res.json({ success: true, data: room });
  } catch (err) {
    next(err);
  }
};

exports.createRoom = async (req, res, next) => {
  try {
    const room = await roomService.createRoom(req.body);
    res.status(201).json({ success: true, data: room });
  } catch (err) {
    next(err);
  }
};

exports.updateRoom = async (req, res, next) => {
  try {
    const room = await roomService.updateRoom(req.params.id, req.body);
    res.json({ success: true, data: room });
  } catch (err) {
    next(err);
  }
};

exports.deleteRoom = async (req, res, next) => {
  try {
    await roomService.deleteRoom(req.params.id);
    res.json({ success: true, message: 'Room deleted safely via service' });
  } catch (err) {
    next(err);
  }
};
