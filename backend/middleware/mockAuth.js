const mockAuth = (req, res, next) => {
  // Mock standard user payload parsing commonly attached by OAuth
  // The system relies on req.user instead of arbitrary body properties
  req.user = {
    id: 'demo_user_1',
    name: 'Poornima Student',
    email: 'demo@poornima.edu.in',
    role: 'student'
  };

  // If the admin panel is calling, we'll gracefully mock admin. In full prod, this relies on JWT claims.
  if (req.originalUrl.includes('/admin')) {
    req.user.role = 'admin';
  }

  next();
};

module.exports = mockAuth;
