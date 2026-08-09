import express from 'express';
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getMe,
} from '../controllers/user.controller.js';

import { registerValidationRules, loginValidationRules } from '../validators/user.validator.js';

import validateRequest from '../middleware/validateRequest.middleware.js';
import { protect } from '../middleware/user.middleware.js';

const router = express.Router();


router.post('/register', registerValidationRules, validateRequest, registerUser);

router.post('/login',loginValidationRules, validateRequest, loginUser);

router.get('/me', protect, getMe);

router.post('/refresh', refreshAccessToken);

router.post('/logout', logoutUser);

export default router;