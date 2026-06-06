import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getUserSavings } from '../database/models/savings.js';
import { addTransaction, getUserTransactions } from '../database/models/transactions.js';


export const transactionsRouter = express.Router();

transactionsRouter.post('/add', authMiddleware, async (req,res,next) => {
 try {
   const userId = req.user.userId;
   const {amount,description,type} = req.body;
   
   if(!userId) {
    const error = new Error('Invalid or missing token!');
    error.status = 401;
    return next(error);
   }

   if(!amount || !description || !type) {
    const error = new Error('Please input all fields!');
    error.status(401);
    return next(error);
   }

    const savings = await getUserSavings(userId);
    console.log(savings)
    if(!savings) {
    const error = new Error('Savings account not found!');
    error.status = 404;
    return next(error);
    }

   const savingsId = savings.id;
   
   await addTransaction(userId,savingsId,amount,description,type);
  
   res.status(200).json({msg:'Transaction added!'})

 } catch (error) {
  next(error)
 }
})

transactionsRouter.get('/get', authMiddleware, async(req,res,next) => {
  try {
    const userId = req.user.userId;
    if(!userId) {
      const error = new Error('Invalid or missing token!');
      error.status = 401;
      return next(error);
    } 

    const transactions = await getUserTransactions(userId); 
    if(!transactions){
      const error = new Error('No transactions found!');
      error.status = 404;
      return next(error);
    }

    res.status(200).json({transactions});
  } catch (error) {
    next(error);
  }
})