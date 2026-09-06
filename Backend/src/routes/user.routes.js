import express from 'express';
import { config } from '../config/config.js';
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getMe,
  googleCallback,
} from '../controllers/user.controller.js';
import passport from "passport";


import { registerValidationRules, loginValidationRules } from '../validators/user.validator.js';

import validateRequest from '../middleware/validateRequest.middleware.js';
import { protect } from '../middleware/user.middleware.js';

const router = express.Router();


router.post('/register', registerValidationRules, validateRequest, registerUser);

router.post('/login', loginValidationRules, validateRequest, loginUser);

router.get('/me', protect, getMe);

router.post('/refresh', refreshAccessToken);

router.post('/logout', logoutUser);


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * Redirects to Google authentication callback
 * @route GET /api/auth/google/callback
 * @group Auth - Operations about user authentication
 */
router.get('/google/callback', passport.authenticate('google',
  {
    session: false,
    failureRedirect: config.NODE_ENV == 'development' ? 'https://oibsip-skh1.onrender.com/login' : "/login",
  }),
  googleCallback
)

export default router;
