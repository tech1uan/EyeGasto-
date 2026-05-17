import {body,param,query,validationResult,matchedData} from 'express-validator';
import { getUserByEmail, getUserByUsername } from '../database/models/users.js';


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
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),

body('confirmPassword')
      .trim()
      .notEmpty().withMessage('Please confirm your password.')
      .custom((value, {req}) => {
            if(value !== req.body.password)  {
            throw new Error('Passwords do not match');
            } else {
            return true
            }
      })
]

export const loginIdentifierValidator = [
body('login')
.trim()
.notEmpty().withMessage('Username or email is required.')
.custom((value) => {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      const isUsername = /^[a-zA-Z0-9_]{3,}$/.test(value);
   if(!isEmail && !isUsername) {
      throw new Error('Enter a valid email or username');
   }
   return true;
})
];
                            
export const loginPasswordValidator = [
 body('password')
      .trim()
      .notEmpty().withMessage('Please provide a password')
]

export const emailValidator = [
body('email')
.trim()
.notEmpty().withMessage('Email is required.')
.bail()
.isEmail().withMessage('Invalid email')
.normalizeEmail()
.bail()
.custom(async (value) => {
      const user = await getUserByEmail(value);

      if(user) {
       throw new Error('Email already in use')
      }

      return true
})
]