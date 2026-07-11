import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { authorizeMiddleware } from '../middleware/authorizeMiddleware.js';
import { addUserFeedback } from '../database/models/feedback.js';
import validate from '../middleware/validate.js';
import { validateFeedback } from '../validators/feedbackValidators.js';


const feedbackRouter = express.Router();



feedbackRouter.post('/add', authMiddleware, authorizeMiddleware('user'), [...validateFeedback],validate, async(req,res,next) => {
try {
    const {userId} = req.user;
    const {rating,type,message} = req.body;

    const data = await addUserFeedback(userId,rating,type,message)

    res.status(200).json({success:true, msg: 'Feedback added successfully!', data})
} catch (error) {
   next(error)
}
})


export default feedbackRouter;