import { body } from 'express-validator';

export const validateFeedback = [
  body('rating')
    .exists({ checkFalsy: true }).withMessage('Rating is required.')
    .bail()
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be a whole number between 1 and 5.')
    .toInt(),

  body('type')
    .exists({ checkFalsy: true }).withMessage('Feedback type is required.')
    .bail()
    .trim()
    .isIn(['bug', 'idea', 'praise', 'other']).withMessage('Type must be one of: bug, idea, praise, other.'),

  body('message')
    .exists({ checkFalsy: true }).withMessage('Message is required.')
    .bail()
    .trim()
    .isLength({ min: 3, max: 1000 }).withMessage('Message must be between 3 and 1000 characters.')
    .escape(),
];

export const feedbackStatusValidator = [
  body("id")
    .isInt({ min: 1 })
    .withMessage("Invalid feedback ID."),

  body("status")
    .isIn(["new", "reviewing", "resolved"])
    .withMessage("Invalid feedback status.")
];