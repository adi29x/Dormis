const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/login-mock', userController.loginMockUser);
router.get('/:userId', userController.getUserProfile);

module.exports = router;
