import {body,param,query,validationResult,matchedData} from 'express-validator';
import { getUserByUsername } from '../database/models/users.js';

export const registerNameValidator = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('Please provide your first name')
    .bail()
    .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters')
    .matches(/^[A-Za-z\s\-'\.]+$/).withMessage('First name contains invalid characters'),

  body('lastName')
    .trim()
    .notEmpty().withMessage('Please provide your last name')
    .bail()
    .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[A-Za-z\s\-'\.]+$/).withMessage('Last name contains invalid characters')
];

export const registerUsernameValidator =[
 body('username')
      .trim()
      .escape()
      .notEmpty().withMessage('Please provide a username')
      .isLength({ min: 3 }).withMessage('Username must be at least 3 characters')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Only letters, numbers, and underscores allowed')
      .bail()
      .custom(async(value) => {
        const user = await getUserByUsername(value)
        if(user) throw new Error('Username already taken')
      })
]

export const registerPasswordValidator = [
 body('password')
       .trim()
      .notEmpty().withMessage('Please provide a password')
      .bail()
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),

body('confirmPassword')
      .trim()
      .notEmpty().withMessage('Please confirm your password.')
      .bail()
      .custom((value, {req}) => {
            if(value !== req.body.password)  {
            throw new Error('Passwords do not match');
            } else {
            return true
            }
      })
]

export const loginUsernameValidator = [
body('login')
.trim()
.notEmpty().withMessage('Username is required.')
.custom((value) => {
   const isUsername = /^[a-zA-Z0-9_]{3,}$/.test(value);
   if(!isUsername) {
      throw new Error('Enter a valid username');
   }
   return true;
})
];
                            
export const loginPasswordValidator = [
 body('password')
      .trim()
      .notEmpty().withMessage('Please provide a password')
]
