import express from 'express';
import { authRouter } from './auth.js';
import { savingsRouter } from './savings.js';
import { transactionsRouter } from './transactions.js';
import { budgetRouter } from './budget.js';
import { expensesRouter } from './expenses.js';
import userRouter from './users.js';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/savings', savingsRouter)
router.use('/transactions', transactionsRouter)
router.use('/budget', budgetRouter)
router.use('/expenses', expensesRouter);
router.use('/users', userRouter);

export default router;