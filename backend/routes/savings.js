import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { addSaving, deductSaving, getUserSavings, setGoalCompletedNotified } from '../database/models/savings.js';
import { inputAmount } from '../validators/inputValidators.js';
import validate from '../middleware/validate.js';
import { getUserByUserID } from '../database/models/users.js';
import { updateSavingsGoal } from '../database/models/goal.js';


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

savingsRouter.post('/add', authMiddleware, inputAmount, validate,  async(req,res,next) => {
  try {
    const userId = req.user.userId;
    const {amount} = req.body

    if(!userId) {
      const error = new Error('Invalid or missing token!')
      error.status = 401;
      return next(error);
    }

    await addSaving(userId,amount);
    
    res.status(200).json({msg:'Balance updated successfuly!'});
  } catch (error) {
    next(error);
  }
})

savingsRouter.post('/deduct', authMiddleware, inputAmount, validate, async(req,res,next) => {
  try {
    const userId = req.user.userId;
    const {amount} = req.body;

    const userSavings = await getUserSavings(userId);

     if(!userSavings) {
      return res.status(404).json({
        msg:'Savings account not found!'
      })
     }

     if(userSavings.balance < amount) {
      return res.status(400).json({msg: 'Insufficient funds!'});
     }

     await deductSaving(userId, amount);

    return res.json({
      msg:'Balance updated successfully!'
     })


  } catch (error) {
    next(error);
  }
})

savingsRouter.post('/goal', authMiddleware, inputAmount, validate, async(req,res,next) => {
  try {
    const {userId} = req.user;
    const {description, amount} = req.body;

    const result = await updateSavingsGoal(userId,description,amount);

    if(!result.success) {
      return res.status(404).json({
        msg:result.message
      })
    }

    return res.status(200).json({
      msg:result.message,
      goal: result.goal
    });

  } catch (error) {
    next(error)
  }

})

savingsRouter.patch('/set-goal-notified', authMiddleware, async(req,res,next) => {
  try {
    const {userId} = req.user;

    const result = await setGoalCompletedNotified(userId);

    res.status(200).json({success:true, result: result.affectedRows})

  } catch (error) {
    next(error)
  }

})
