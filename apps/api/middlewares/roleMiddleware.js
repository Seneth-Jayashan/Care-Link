// middlewares/roleMiddleware.js

// Higher-order function to check allowed roles
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user should be set by authMiddleware
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ msg: 'Forbidden: You do not have permission to perform this action.' });
    }
    next(); // Role is allowed
  };
};

export default authorize;
