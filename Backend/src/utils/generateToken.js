import jwt from 'jsonwebtoken';
import {config} from '../config/config.js';

// Access token -> short-lived (15 min)
export const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    config.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

// Refresh token -> long-lived (7 din), 
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    config.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};