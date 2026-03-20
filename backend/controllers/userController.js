const User = require('../models/User');

exports.loginMockUser = async (req, res, next) => {
  try {
    const { userId, name, email, role } = req.body;
    
    let user = await User.findOne({ userId });
    if (!user) {
      user = new User({ userId, name, email, role });
      await user.save();
    } else if (role && user.role !== role) {
      // Allow role switching during mock sessions
      user.role = role;
      await user.save();
    }
    
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ userId: req.params.userId }).populate('bookingId waitlistId');
    if (!user) throw new Error('User not found');
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};
