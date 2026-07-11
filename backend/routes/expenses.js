import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js';
import { addExpense, deleteExpense, editExpense, getComparisonStats, getDailyStats, getExpenseHeatMap, getExpensesAllTime, getExpensesByRange, getExpensesForToday, getExpensesForWeek, getMonthlyStats, getProfileStats, getRecentExpenses, getThisMonthStats, getTotalExpenses } from '../database/models/expenses.js';
import { deleteInsights } from '../database/models/insights.js';

export const expensesRouter = express.Router();



expensesRouter.get('/', authMiddleware, async(req,res,next) => {

  try {
    const userId = req.user.userId;
    const expenses = await getUserExpenses(userId);
   
    if(!expenses || expenses.length === 0) {
      const error = new Error('No data found!');
      error.status = 404;
      return next(error);
    } 
    res.status(200).json({success: true, expenses});

  } catch (error) {
   next(error)
  }
})

expensesRouter.post('/', authMiddleware, async(req,res,next) => {
  try {
    const {userId} = req.user
    const {amount,categoryId,description} = req.body;
  
    if(!amount) {
      const error = new Error('Please input amount!');
      error.status = 400;
      return next(error);
    }

    if(isNaN(amount)) {
      const error = new Error('Invalid amount!')
      error.status = 400;
      return next(error);
      }

    if(isNaN(categoryId)) {
      const error = new Error('Invalid category id!');
      error.status = 400;
      return next(error);
    }
    
    if(!categoryId) {
      const error = new Error('Please input category!');
      error.status = 400;
      return next(error);
    }

    const expense = await addExpense(userId,description,amount,categoryId)
    await deleteInsights(userId);


    res.status(200).json({success: true, expense});
  } catch (error) {
    next(error)
  }
}) 

expensesRouter.delete('/',authMiddleware, async(req,res,next) => {
try {
 
  const {userId} = req.user;
  
  const {expenseId} = req.body;
      if(!expenseId) {
        const error = new Error('Please provide the expense id! ')
        error.status = 400;
        return next(error);
      }

  const result = await deleteExpense(expenseId,userId);
  await deleteInsights(userId);

  res.status(200).json({
    success: true, 
    expense: result
  });

} catch (error) {
  next(error)
}

})

expensesRouter.put('/', authMiddleware, async(req,res,next) => {
  try {
    const {userId} = req.user;

    const {amount, categoryId, description} = req.body;
    if(amount == null || categoryId == null || description == null|| description.trim() === '') {
      const error = new Error('Missing fields!');
      error.status = 400;
      return next(error);
    }

    const {expenseId} = req.body;
    if(expenseId == null) {
      const error = new Error('Please provide the expense id!');
      error.status = 400;
      return next (error);
    }

    const result = await editExpense(amount,categoryId, description,expenseId,userId);
    await deleteInsights(userId);

    res.status(200).json({
      success: true, 
      expense: result
    })
  } catch (error) {
    next(error)
  }
})

expensesRouter.get('/today', authMiddleware, async(req,res,next) => {
  try {
    const {userId} = req.user;
     
    const data = await getExpensesForToday(userId);
    res.status(200).json({success: true, expenses: data});
  } catch (error) {
    next(error)
  }
})

expensesRouter.get('/last7', authMiddleware, async(req,res,next) => {
  try {
    const {userId} = req.user;

    const data = await getExpensesForWeek(userId);
    res.status(200).json({success: true, expenses: data});
  } catch (error) {
    next(error)
  }
})


expensesRouter.get('/alltime', authMiddleware, async(req,res,next) => {
  try {
    const {userId} = req.user;

     
    const data = await getExpensesAllTime(userId);
    res.status(200).json({success: true, expenses: data});
  } catch (error) {
    next(error)
  }
})


expensesRouter.get('/summary/:range', authMiddleware, async(req,res,next) => {
  try {
    const {userId} = req.user;
    const {range} = req.params;

    const data = await getTotalExpenses(userId, range);

    res.status(200).json({success: true, expenses:data})
  } catch (error) {
    next(error)
  }
})
expensesRouter.get('/month/stats/', authMiddleware, async (req,res,next) => {
  try {
    const {userId} = req.user;
  
    const data = await getThisMonthStats(userId);
    res.status(200).json({
      success: true,
      totalSpent: data
    })
  } catch (error) {
    next(error)
  }
});

expensesRouter.get('/profile/stats/', authMiddleware, async (req,res,next) => {
  try {
    const {userId} = req.user;
  
    const data = await getProfileStats(userId);
    res.status(200).json({
      success: true,
      profileStats: data
    })
  } catch (error) {
    next(error)
  }
});

expensesRouter.get('/month/:range', authMiddleware, async (req,res,next) => {
  try {
    const {userId} = req.user;
    const {range} = req.params;

    const data = await getComparisonStats(userId, range);
    res.status(200).json({
      stats:data
    })
  } catch (error) {
    next(error)
  }
});

expensesRouter.get('/month/stats/:range', authMiddleware, async (req,res,next) => {
  try {
    const {userId} = req.user;
    const {range} = req.params;

    const data = await getMonthlyStats(userId, range);
    res.status(200).json({
      stats:data
    })
  } catch (error) {
    next(error)
  }
});

expensesRouter.get('/recent', authMiddleware, async(req,res,next) => {
  try {
    const {userId} = req.user;
    const {filter} = req.query;
    
    const data = await getRecentExpenses(userId,filter);

    res.status(200).json({success: true, expenses:data})
    
  } catch (error) {
    next(error);
  }
})

expensesRouter.get('/filter/:range', authMiddleware, async(req,res,next) => {
  try {
      const {userId} = req.user
      const {range} = req.params
      

      const data = await getExpensesByRange(userId, range);
      
      res.status(200).json({success:true, expenses:data})
  } catch (error) {
    next(error)
  }
})

expensesRouter.get('/heatmap', authMiddleware, async(req,res,next) => {
  try {
      const {userId} = req.user

      const data = await getExpenseHeatMap(userId);

      res.status(200).json({success:true, expenses:data})
  } catch (error) {
    next(error)
  }
})

expensesRouter.get('/daily-stats', authMiddleware, async(req,res,next) => {
  try {
      const {userId} = req.user

      const data = await getDailyStats(userId);

      res.status(200).json({success:true, data})
  } catch (error) {
    next(error)
  }
})