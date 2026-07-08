import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getNotifications, pushNotification, setNotificationRead } from '../database/models/notifications.js';
import { notificationValidator, setReadValidator } from '../validators/notificationValidator.js';
import { matchedData } from 'express-validator';
import { getNotificationStatus, updateLastReminderDate, updateLastTipDate } from '../database/models/users.js';

export const notificationsRouter = express.Router();

notificationsRouter.post('/add', authMiddleware, [...notificationValidator], async(req,res,next) => {
     
    const {userId} = req.user;
    const {mood,title,message} = matchedData(req);
    try {
    const result = await pushNotification(userId, mood, title, message)

    res.status(200).json({success:true, notifcations: result});

    } catch (error) {
           next(error)
    }
})

notificationsRouter.get('/get', authMiddleware, async(req,res,next) => {
     
    const {userId} = req.user;
    try {
    const result = await getNotifications(userId)
 
    res.status(200).json({success:true, notifications:result});

    } catch (error) {
      next(error)
    }
})

notificationsRouter.patch('/set-read', authMiddleware, setReadValidator, async(req,res,next) => {
     
    const {userId} = req.user;
    const {notificationId} = req.body
    try {
    const result = await setNotificationRead(userId,notificationId)
 
    res.status(200).json({success:true, result});

    } catch (error) {
      next(error)
    }
})
notificationsRouter.get(
  "/notif-status",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { userId } = req.user;

      const data = await getNotificationStatus(userId);

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
);


notificationsRouter.patch(
  '/tip',
  authMiddleware,
  async (req, res, next) => {
    try {

      const { userId } = req.user;

      await updateLastTipDate(userId);

      res.json({
        success: true
      });

    } catch (error) {
      next(error);
    }
});

notificationsRouter.patch(
  '/reminder',
  authMiddleware,
  async (req, res, next) => {
    try {

      const { userId } = req.user;

      await updateLastReminderDate(userId);

      res.json({
        success: true
      });

    } catch (error) {
      next(error);
    }
});