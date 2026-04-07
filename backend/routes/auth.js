import express from 'express';
import bcrypt from 'bcrypt';
import { createUser,getAllUsers } from '../database/config.js';

export const authRouter = express.Router();


authRouter.get('/register', async (req,res,next) => {
    const {username,password} = req.body;

    if(!username || !password) {
    const error = new Error ('Please input username and password!');
    error.status = 400;
    return next(error);
    }

try {
  const existingUsers = await getAllUsers(); 
   
  const userExist = existingUsers.find(user => user.username === username);

  if(userExist) {
    const error = new Error('User already exists!')
    error.status = 400;
    return next(error);
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  await createUser (username,hashedPassword);
  res.status(201).json({msg:'Successfully created account!'});

} catch (error) {
  next(error);
}

});


