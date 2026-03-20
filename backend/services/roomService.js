const mongoose = require('mongoose');
const Room = require('../models/Room');
const config = require('../config/config');

class RoomService {
  async getAllRooms(filter) {
    return await Room.find(filter);
  }

  async getRoomById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error(`Invalid identifier: ${id}`);
    }
    const room = await Room.findById(id);
    if (!room) throw new Error('Room not found');
    return room;
  }

  async createRoom(roomData) {
    const room = new Room(roomData);
    await room.save();
    return room;
  }

  async bulkCreateRooms({ blockPrefix, startFloor, endFloor, roomsPerFloor, type, capacity }) {
    const newRooms = [];
    for (let floor = parseInt(startFloor); floor <= parseInt(endFloor); floor++) {
      for (let i = 1; i <= parseInt(roomsPerFloor); i++) {
        const roomNum = `${i < 10 ? '0' + i : i}`;
        newRooms.push({
          roomNumber: `${blockPrefix}-${floor}${roomNum}`,
          type,
          capacity: parseInt(capacity),
          status: 'Available',
          occupants: []
        });
      }
    }
    await Room.insertMany(newRooms);
    return newRooms;
  }

  async updateRoom(id, updateData) {
    const room = await Room.findById(id);
    if (!room) throw new Error('Room not found');
    
    if (updateData.capacity) room.capacity = updateData.capacity;
    if (updateData.type) room.type = updateData.type;
    
    const occupiedCount = room.occupants.length;
    if (occupiedCount >= room.capacity) room.status = 'Full';
    else if (occupiedCount > 0) room.status = 'Partially Filled';
    else room.status = 'Available';
    
    await room.save();
    return room;
  }

  async deleteRoom(id) {
    await Room.findByIdAndDelete(id);
    return true;
  }

  // Used periodically to recalculate accurate statuses securely
  async recalculateRoomStatus(id) {
    const room = await Room.findById(id);
    if (!room) throw new Error('Room not found');
    
    const count = room.occupants.length;
    let newStatus = 'Available';
    if (count >= room.capacity) newStatus = 'Full';
    else if (count > 0) newStatus = 'Partially Filled';

    if (room.status !== newStatus) {
      room.status = newStatus;
      await room.save();
    }
    return room;
  }
}

module.exports = new RoomService();
