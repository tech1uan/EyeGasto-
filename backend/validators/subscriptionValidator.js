import { body } from "express-validator";



export const subscriptionValidator = [
  body().isObject().withMessage('Subscription data is required'),

  body('endpoint')
    .exists().withMessage('Endpoint is required')
    .bail()
    .isURL().withMessage('Invalid subscription endpoint'),

  body('keys')
    .exists().withMessage('Keys object is required')
    .bail()
    .isObject().withMessage('Keys must be an object'),

  body('keys.p256dh')
    .exists().withMessage('Missing p256dh key')
    .bail()
    .notEmpty().withMessage('p256dh key cannot be empty'),

  body('keys.auth')
    .exists().withMessage('Missing auth key')
    .bail()
    .notEmpty().withMessage('auth key cannot be empty'),
];

export const subscriptionIdValidator = [
    body('subscriptionId').notEmpty().isInt().withMessage('Please provide a valid subscription id!')
]

export const notifyValidator = [
    body('title').notEmpty().withMessage('Title is required'),
    body('body').notEmpty().withMessage('Body is required')
]

export const unsubscribeValidator = [
    body("endpoint")
        .exists().withMessage("Endpoint is required")
        .bail()
        .isURL().withMessage("Invalid subscription endpoint")
];