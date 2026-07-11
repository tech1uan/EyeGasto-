import { body, query } from 'express-validator';
import { getUserByEmail, getUserByUsername } from '../database/models/users.js';

export const inputDescription = [
  body('description')
    .trim()
    .notEmpty().withMessage('Please provide a description')
    .isLength({ min: 2, max: 100 }).withMessage('Description must be 2–100 characters')
    .matches(/^[a-zA-Z0-9\s_-]+$/).withMessage('Only letters, numbers, spaces, _ and - allowed')
];

export const inputAmount = [
  body('amount')
    .notEmpty().withMessage('Amount is required')
    .bail() 
    .isNumeric().withMessage('Amount must contain numbers only')
    .bail()
    .isFloat({ min: 0.01 }).withMessage('Amount must be a number greater than 0')
    .toFloat()
];

export const updateProfileValidator = [
  body('newFirstName')
    .trim()
    .notEmpty().withMessage('Please provide your first name')
    .bail()
    .isLength({ min: 2, max: 50 }) 
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[A-Za-z\s\-'.]+$/)
    .withMessage('First name contains invalid characters'),

  body('newLastName')
    .trim()
    .notEmpty().withMessage('Please provide your last name')
    .bail()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[\p{L}\s\-'.]+$/u)
    .withMessage('Last name contains invalid characters'),

  body('newUsername')
    .trim()
    .notEmpty().withMessage('Please provide a username')
    .bail()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Only letters, numbers, and underscores are allowed')
    .bail()
    .custom(async (value, { req }) => {
      const user = await getUserByUsername(value);

      if (user && user.id !== req.user.userId) {
        throw new Error('Username already taken');
      }

      return true;
    }),

];


export const updateEmailValidator = [
    body('newEmail')
    .trim()
    .notEmpty().withMessage('Please provide an email address')
    .bail()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail()
    .bail()
    .custom(async (value, { req }) => {
      const user = await getUserByEmail(value);

      if (user && user.id !== req.user.userId) {
        throw new Error('Email already in use');
      }

      return true;
    }),

    body('code')
    .trim()
    .notEmpty()
    .withMessage('Verification code is required')
    .bail()
    .isLength({ min: 6, max: 6 })
    .withMessage('Verification code must be 6 digits')
    .bail()
    .isNumeric()
    .withMessage('Verification code must contain only numbers')
]


export const changePasswordValidator = [
  body('currentPassword')
  .trim()
  .notEmpty()
  .withMessage('Current password is required'),

  body('newPassword')
  .trim()
  .notEmpty()
  .withMessage('New password is required') 
  .bail()
  .isLength({min:8})
  .withMessage('New password must be at least 8 characters.')
  .custom((value, {req}) => {
    if(value === req.body.currentPassword)  {
      throw new Error('New passowrd must be different from your current password');
    }
    return true;
  }),

  body('confirmPassword')
  .trim()
  .notEmpty()
  .withMessage('Please confirm your new password')
  .bail()
  .custom((value, {req}) => {
    if(value !== req.body.newPassword) {
      throw new Error('Passwords do not match');
    }
    return true;
  })
]


export const budgetRangeValidator = [
  body('range')
    .isIn(['daily', 'monthly'])
    .withMessage('Budget range must be daily or monthly.')
];


export const budgetRangeQueryValidator = [
  query('range')
    .exists()
    .withMessage('Budget range is required.')
    .bail()
    .isIn(['daily', 'monthly'])
    .withMessage('Budget range must be either daily or monthly.')
];