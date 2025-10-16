import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) { res.status(401); throw new Error('Not authorized, token missing'); }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) { res.status(401); throw new Error('User not found'); }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};