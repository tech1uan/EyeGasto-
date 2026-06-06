import { body } from 'express-validator';

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
    .isFloat({ min: 1 }).withMessage('Amount must be a number greater than 0')
    .toFloat()
];