import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {addBudget,editBudget, getBudgetComparison, getUserBudgetSummary } from '../database/models/budget.js';
import { budgetRangeQueryValidator, budgetRangeValidator, inputAmount } from '../validators/inputValidators.js';
import validate from '../middleware/validate.js';
import { matchedData } from 'express-validator';
import { deleteInsights } from '../database/models/insights.js';


export const budgetRouter = express.Router(); 


budgetRouter.post('/add', authMiddleware, inputAmount, budgetRangeValidator, validate, async(req,res,next) => {
  try {
    const {userId} = req.user;
    const {amount,range} = matchedData(req);
    

    const update = await addBudget(userId,amount,range);
    await deleteInsights(userId);

    res.status(200).json({msg:'Amount updated successfully!',dbData:update})

  } catch (error) {
    next(error)
  }
})

budgetRouter.put('/edit', authMiddleware, inputAmount, budgetRangeValidator, validate, async(req,res,next) => {
  try {
    const {userId} = req.user;
    const {amount,range} = matchedData(req);

    const update =  await editBudget(userId,amount,range);
      await deleteInsights(userId);

    res.status(200).json({msg:'Amount updated successfully!', update});

  } catch (error) {
    next(error)
  }
})

budgetRouter.get('/summary/', authMiddleware, budgetRangeQueryValidator, validate, async (req,res,next) => {
  try {
     const {userId} = req.user
     const {range} = matchedData(req);

     const budget = await getUserBudgetSummary(userId,range)

    res.status(200).json({
      success:true,
      amounts: budget
    })
  } catch (error) {
    next(error)
  }
})

budgetRouter.get('/comparison', authMiddleware, async(req,res,next) => {
  try {
    const {userId} = req.user;

    const budgetComparison = await getBudgetComparison(userId);

    res.status(200).json({budgetComparison});

  } catch (error) {
    next(error)
  }
})