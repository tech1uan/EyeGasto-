import express from 'express';
import { authRouter } from './auth.js';
import { savingsRouter } from './savings.js';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/savings', savingsRouter)

export default router;