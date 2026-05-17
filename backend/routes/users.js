import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getUserByUserID } from '../database/models/users.js';


const userRouter = express.Router();

userRouter.get('/', authMiddleware, async(req,res,next) => {
try {
  const {userId} = req.user; 

  if(!userId) {
   const error = new Error('Invalid or missing token!');
   error.status = 401;
   return next(error);
  }

  const user = await getUserByUserID(userId);
  res.status(200).json({user});
} catch (error) {
  next(error)
}

})

export default userRouter;