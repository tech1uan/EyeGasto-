import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { authorizeMiddleware } from '../middleware/authorizeMiddleware.js';
import { getActiveUsersToday, getNewSignups, getRecentUsers, getTotalUsersByRange, getUserGrowth } from '../database/models/users.js';
import { archiveFeedback, getUserFeedbacks, setUserFeedbackStatus } from '../database/models/feedback.js';
import { feedbackStatusValidator } from '../validators/feedbackValidators.js';
import validate from '../middleware/validate.js';
import { pushNotificationValidator } from '../validators/notificationValidator.js';
import { insertNotificationForUser } from '../database/models/notifications.js';
import { matchedData } from 'express-validator';


const adminRouter= express.Router();

adminRouter.get(
    "/dashboard",
    authMiddleware,
    authorizeMiddleware("admin"),
    async (req, res, next) => {
        try {

            const range = req.query.range || "last7";
            const feedbackRange = req.query.feedbackRange || "all";

            const totalUsers = await getTotalUsersByRange(range);
            const activeUsers = await getActiveUsersToday();
            const signups = await getNewSignups(range);
            const recentUsers = await getRecentUsers();

            const feedbacks = await getUserFeedbacks(feedbackRange);
            console.log(feedbackRange)
            const userGrowth = await getUserGrowth(range);

            res.status(200).json({
                totalUsers,
                activeUsers,
                signups,
                recentUsers,
                feedbacks,
                userGrowth
            });

        } catch (error) {
            next(error);
        }
    }
);

adminRouter.patch("/set-feedback-status", authMiddleware, authorizeMiddleware("admin"), [...feedbackStatusValidator], validate, async (req,res,next) => {
 try {
    
    const {id, status} = matchedData(req)

    const affectedRows =  await setUserFeedbackStatus(id, status);

    console.log(id,status)
    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found."
      });
    }
    
    res.status(200).json({
      success: true,
      affectedRows
    });

  } catch (error) {
    next(error);
  }
}
);

adminRouter.post(
  '/push',
  authMiddleware,
  authorizeMiddleware('admin'),
  pushNotificationValidator,
  validate,
  async (req, res, next) => {
    try {
      const { userId, mood, title, message } = matchedData(req);

      await insertNotificationForUser(userId, mood, title, message);

      res.status(201).json({ msg: 'Notification sent!' });
    } catch (error) {
      next(error);
    }
  }
);


adminRouter.patch(
    "/archive-feedback",
    authMiddleware,
    authorizeMiddleware("admin"),
    async (req,res,next)=>{
        try{

            const { id } = req.body;
            if (!id) {
                return res.status(400).json({
                    msg: "Invalid feedback id"
                });
            }
            const affectedRows = await archiveFeedback(id);

            if(!affectedRows){
                return res.status(404).json({
                    msg:"Feedback not found."
                });
            }

            res.json({
                success:true
            });

        }catch(error){
            next(error);
        }
    }
);
export default adminRouter;