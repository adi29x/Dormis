const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.get('/', bookingController.getAllBookings);
router.get('/user', bookingController.getUserBooking);
router.get('/user/:userId', bookingController.getUserBooking);
router.post('/', bookingController.createBooking);
router.delete('/:id', bookingController.cancelBooking);

module.exports = router;
