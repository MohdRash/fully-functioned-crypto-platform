const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Temporarily bypass token verification for development
  // In a real application, you would verify the token here.
  if (process.env.NODE_ENV === 'development') {
    req.user = { id: '60d5ec49f8e9c3001c8c4d4a' }; // Replace with a dummy user ID for testing
    return next();
  }

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token (original logic)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};