import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {addBudget,editBudget, getUserBudgetSummaryToday } from '../database/models/budget.js';

export const budgetRouter = express.Router();


budgetRouter.get('/summary/today', authMiddleware, async (req,res,next) => {
  try {
     const {userId} = req.user

     if(!userId) {
      const error = new Error('Invalid or missing token!');
      error.status = 401;
      return next(error);
     }

     const budget = await getUserBudgetSummaryToday(userId)
    res.status(200).json({
      success:true,
      budget
    })
  } catch (error) {
    next(error)
  }
})


budgetRouter.post('/add', authMiddleware, async(req,res,next) => {
  try {
    const {userId} = req.user;
    const {amount} = req.body;
    const parsedAmount = Number(amount);
    if( parsedAmount == null) {
      const error = new Error('Please enter an amount!');
      error.status = 400;
      return next(error);
    }

    if(isNaN(parsedAmount)) {
      const error = new Error('Amount must be a number');
      error.status = 400;
      return next(error);
    }
    
    if(parsedAmount < 0) {
      const error = new Error('Amount must be greater than 0');
      error.status = 400;
      return next(error);
    }

    const update = await addBudget(userId,parsedAmount);
  
    res.status(200).json({msg:'Amount updated successfully!',dbData:update})

  } catch (error) {
    next(error)
  }
})


budgetRouter.put('/edit', authMiddleware, async(req,res,next) => {
  try {
    const {userId} = req.user;
    const {amount} = req.body;
    const parsedAmount = Number(amount);

    if(parsedAmount == null) {
      const error = new Error ('Please enter an amount');
      error.status = 400;
      return next(error);
    }

    if(isNaN(parsedAmount)) {
      const error = new Error ('Amount must be a number!');
      error.status = 404;
      return next(error);
    }

    if(parsedAmount < 0) {
      const error = new Error('Amount cannot be negative');
      error.status = 400; 
      return next(error);
    }

    const update =  await editBudget(userId,parsedAmount);

    res.json({msg:'Amount updated successfully!', update});

  } catch (error) {
    next(error)
  }
})
