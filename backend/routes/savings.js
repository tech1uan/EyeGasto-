import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { addSaving, deductSaving, getUserSavings } from '../database/models/savings.js';


export const savingsRouter = express.Router();


savingsRouter.get('/', authMiddleware, async (req,res,next) => {
  try {
    const userId = req.user.userId
        
    if(!userId) {
      const error = new Error('Invalid or missing token!');
      error.status = 401;
      return next(error);
    }

    const savings = await getUserSavings(userId);

    if(!savings || savings.length === 0){
      const error = new Error('No data found!');
      error.status = 404;
      return next(error);
    }

    res.status(200).json(savings);
  } catch (error) {
    next(error);
  }
  
})

savingsRouter.post('/add', authMiddleware, async(req,res,next) => {
  try {
    const userId = req.user.userId;
    const {balance} = req.body

    if(!userId) {
      const error = new Error('Invalid or missing token!')
      error.status = 401;
      return next(error);
    }

    await addSaving(userId,balance);
    res.status(200).json({msg:'Balance updated successfuly!'});
  } catch (error) {
    next(error);
  }
})

savingsRouter.post('/deduct', authMiddleware, async(req,res,next) => {
  try {
    const userId = req.user.userId;
    const balance = req.body.balance;

    if(!userId) {
      const error = new Error('Invalid or missing token!')
      error.status = 401;
      return next(error);
    }

    await deductSaving(userId,balance);
    res.json({msg:'Balance updated successfuly!'});
  } catch (error) {
    next(error);
  }
})

