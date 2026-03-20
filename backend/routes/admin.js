const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/stats', adminController.getStats);
router.delete('/reset', adminController.resetSystem);
router.post('/bulk-rooms', adminController.bulkCreateRooms);
router.post('/seed-demo', adminController.seedDemo);

module.exports = router;
