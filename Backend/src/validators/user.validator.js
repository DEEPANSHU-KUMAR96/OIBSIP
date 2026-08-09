import { body } from 'express-validator';

export const registerValidationRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('name is required')
    .isLength({ min: 3 })
    .withMessage('name must be at least 2 characters long'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('email is required')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('password is required')
    .isLength({ min: 8 })
    .withMessage('password must be at least 8 characters long')
    .matches(/\d/)
    .withMessage('pasword must contain a number '),
];

export const loginValidationRules = [
  body('email').trim().notEmpty().withMessage('email is required').isEmail().withMessage('email is required'),
  body('password').notEmpty().withMessage('password is required'),
];