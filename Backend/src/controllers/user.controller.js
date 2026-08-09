import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 din
};

// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists'
      });
    }

    const user = await User.create({
      name, email, password
    });

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, refreshCookieOptions);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const firstError = Object.values(error.errors)[0].message;
      return res.status(400).json({
        message: firstError
      });
    }
    res.status(500).json({
      message: 'Server error', error: error.message
    });
  }
};

// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email
    }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, refreshCookieOptions);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error', error: error.message
    });
  }
};


// @route   GET /api/auth/me
// @desc    Logged-in user details
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error', error: error.message
    });
  }
};

// @route   POST /api/auth/refresh
export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not found' });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(403).json({
         message: 'Refresh token invalid' 
        });
    }

    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ 
        message: 'Unauthorized'
       });
    }

    const newAccessToken = generateAccessToken(user._id, user.role);
    res.status(200).json({ 
      accessToken: newAccessToken 
    });
  } catch (error) {
    res.status(500).json({
       message: 'Server error', error: error.message 
      });
  }
};

// @route   POST /api/auth/logout
export const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      await User.findOneAndUpdate({
         refreshToken 
        }, {
           refreshToken: null 
          });
    }

    res.clearCookie('refreshToken', refreshCookieOptions);
    res.status(200).json({
       message: 'user logout successful'
       });
  } catch (error) {
    res.status(500).json({
       message: 'Server error', error: error.message 
      });
  }
};