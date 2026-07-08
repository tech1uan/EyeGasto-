import { body } from "express-validator";

export const notificationValidator = [
  body("mood")
    .trim()
    .notEmpty().withMessage("Mood is required.")
    .isLength({ max: 20 }),

  body("title")
    .trim()
    .notEmpty().withMessage("Title is required.")
    .isLength({ max: 100 }),

  body("message")
    .trim()
    .notEmpty().withMessage("Message is required.")
];

export const setReadValidator = [
  body('notificationId')
    .notEmpty().withMessage('notificationId required')
    .isInt({ min: 1 }).withMessage('invalid notificationId')
];


export const pushNotificationValidator = [
  body('userId').isInt().withMessage('Valid userId is required'),
  body('mood').isIn(['happy', 'excited', 'concerned', 'worried']).withMessage('Invalid mood'),
  body('title').trim().isLength({ min: 1, max: 255 }).withMessage('Title is required'),
  body('message').trim().isLength({ min: 1, max: 1000 }).withMessage('Message is required'),
];