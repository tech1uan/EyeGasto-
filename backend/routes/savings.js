import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getUserSavings } from '../database/models/savings.js';


export const savingsRouter = express.Router();


savingsRouter.get('/', authMiddleware, async (req,res,next) => {
  try {
    const userId = req.user.userId
    const savings = await getUserSavings(userId);
   
  res.status(200).json(savings);
  } catch (error) {
    next(error);
  }
  
})